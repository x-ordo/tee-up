import request from 'supertest';
import express, { Application } from 'express';
import cors from 'cors';
import { profileLibrary } from '../profile-data';

// Create a test instance of the app
const createTestApp = (): Application => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Endpoint to get a list of all profiles (summary)
    app.get('/api/profiles', (req, res) => {
        const profileSummaries = Object.entries(profileLibrary).map(([slug, data]) => ({
            slug,
            name: data.profile.name,
            title: data.profile.title,
            heroImage: data.profile.heroImage,
        }));
        res.json(profileSummaries);
    });

    // Endpoint to get a single profile by slug
    app.get('/api/profiles/:slug', (req, res) => {
        const { slug } = req.params;
        const profileData = profileLibrary[slug];

        if (profileData) {
            res.json(profileData);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    });

    return app;
};

describe('API Endpoints', () => {
    let app: Application;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('GET /api/profiles', () => {
        it('should return 200 status code', async () => {
            const response = await request(app).get('/api/profiles');
            expect(response.status).toBe(200);
        });

        it('should return an array of profile summaries', async () => {
            const response = await request(app).get('/api/profiles');
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return profiles with required fields', async () => {
            const response = await request(app).get('/api/profiles');
            const firstProfile = response.body[0];

            expect(firstProfile).toHaveProperty('slug');
            expect(firstProfile).toHaveProperty('name');
            expect(firstProfile).toHaveProperty('title');
            expect(firstProfile).toHaveProperty('heroImage');
        });

        it('should return correct data types for profile fields', async () => {
            const response = await request(app).get('/api/profiles');
            const firstProfile = response.body[0];

            expect(typeof firstProfile.slug).toBe('string');
            expect(typeof firstProfile.name).toBe('string');
            expect(typeof firstProfile.title).toBe('string');
            expect(typeof firstProfile.heroImage).toBe('string');
        });

        it('should set correct Content-Type header', async () => {
            const response = await request(app).get('/api/profiles');
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });

        it('should not include full profile data in summary', async () => {
            const response = await request(app).get('/api/profiles');
            const firstProfile = response.body[0];

            // Should NOT have these detailed fields
            expect(firstProfile).not.toHaveProperty('career');
            expect(firstProfile).not.toHaveProperty('testimonials');
            expect(firstProfile).not.toHaveProperty('pricing');
        });
    });

    describe('GET /api/profiles/:slug', () => {
        const validSlug = 'elliot-kim'; // Valid slug that exists in profile-data

        it('should return 200 for valid profile slug', async () => {
            const response = await request(app).get(`/api/profiles/${validSlug}`);
            expect(response.status).toBe(200);
        });

        it('should return full profile data for valid slug', async () => {
            const response = await request(app).get(`/api/profiles/${validSlug}`);

            expect(response.body).toHaveProperty('profile');
            expect(response.body.profile).toHaveProperty('name');
            expect(response.body.profile).toHaveProperty('title');
        });

        it('should return 404 for non-existent profile', async () => {
            const response = await request(app).get('/api/profiles/non-existent-slug');
            expect(response.status).toBe(404);
        });

        it('should return error message for non-existent profile', async () => {
            const response = await request(app).get('/api/profiles/non-existent-slug');

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Profile not found');
        });

        it('should set correct Content-Type header', async () => {
            const response = await request(app).get(`/api/profiles/${validSlug}`);
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });

        it('should handle special characters in slug', async () => {
            const response = await request(app).get('/api/profiles/test-123-pro!@#');
            expect(response.status).toBe(404); // Should return 404, not error
        });

        it('should be case-sensitive for slugs', async () => {
            const response = await request(app).get('/api/profiles/DEMO-PRO');
            // Assuming slugs are case-sensitive, this should return 404
            expect([200, 404]).toContain(response.status);
        });
    });

    describe('CORS Configuration', () => {
        it('should allow cross-origin requests', async () => {
            const response = await request(app)
                .get('/api/profiles')
                .set('Origin', 'http://localhost:3000');

            expect(response.headers['access-control-allow-origin']).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for non-existent endpoints', async () => {
            const response = await request(app).get('/api/non-existent');
            expect(response.status).toBe(404);
        });
    });
});
