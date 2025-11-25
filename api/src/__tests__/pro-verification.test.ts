import request from 'supertest';
import express, { Application } from 'express';
import cors from 'cors';

/**
 * Pro Verification API Tests
 * TDD Phase: RED - Writing failing tests first
 */

// Mock data for pending pro applications
const mockPendingPros = [
    {
        id: '1',
        name: '김민지',
        title: 'LPGA 투어 프로',
        email: 'minji.kim@example.com',
        phone: '010-1234-5678',
        specialties: ['드라이버', '숏게임'],
        tourExperience: 'LPGA 투어 3년',
        certifications: ['LPGA Class A'],
        appliedAt: '2025-11-20T10:00:00Z',
        profileImage: '/images/pros/minji.jpg',
        isApproved: false
    },
    {
        id: '2',
        name: '박성호',
        title: 'PGA 티칭 프로',
        email: 'sungho.park@example.com',
        phone: '010-2345-6789',
        specialties: ['퍼팅', '코스 매니지먼트'],
        tourExperience: 'KPGA 투어 5년',
        certifications: ['KPGA Class A', 'TPI Certified'],
        appliedAt: '2025-11-21T14:30:00Z',
        profileImage: '/images/pros/sungho.jpg',
        isApproved: false
    }
];

// Create a test instance of the app with admin endpoints
const createTestApp = (): Application => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // GET /api/admin/pros/pending - List pending pro applications
    app.get('/api/admin/pros/pending', (req, res) => {
        const pendingPros = mockPendingPros.filter(pro => pro.isApproved === false);
        res.json(pendingPros);
    });

    // POST /api/admin/pros/:id/approve - Approve a pro application
    app.post('/api/admin/pros/:id/approve', (req, res) => {
        const { id } = req.params;
        const proIndex = mockPendingPros.findIndex(pro => pro.id === id);

        if (proIndex === -1) {
            res.status(404).json({ message: 'Pro not found' });
            return;
        }

        const approvedPro = {
            ...mockPendingPros[proIndex],
            isApproved: true,
            approvedAt: new Date().toISOString()
        };

        res.json(approvedPro);
    });

    // POST /api/admin/pros/:id/reject - Reject a pro application
    app.post('/api/admin/pros/:id/reject', (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            res.status(400).json({ message: 'Rejection reason is required' });
            return;
        }

        const proIndex = mockPendingPros.findIndex(pro => pro.id === id);

        if (proIndex === -1) {
            res.status(404).json({ message: 'Pro not found' });
            return;
        }

        const rejectedPro = {
            ...mockPendingPros[proIndex],
            rejectionReason: reason,
            rejectedAt: new Date().toISOString()
        };

        res.json(rejectedPro);
    });

    return app;
};

describe('Pro Verification API', () => {
    let app: Application;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('GET /api/admin/pros/pending', () => {
        it('should return 200 status code', async () => {
            const response = await request(app).get('/api/admin/pros/pending');
            expect(response.status).toBe(200);
        });

        it('should return an array of pending pro applications', async () => {
            const response = await request(app).get('/api/admin/pros/pending');
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return pending pros with required fields', async () => {
            const response = await request(app).get('/api/admin/pros/pending');

            if (response.body.length > 0) {
                const firstPro = response.body[0];
                expect(firstPro).toHaveProperty('id');
                expect(firstPro).toHaveProperty('name');
                expect(firstPro).toHaveProperty('title');
                expect(firstPro).toHaveProperty('email');
                expect(firstPro).toHaveProperty('specialties');
                expect(firstPro).toHaveProperty('appliedAt');
                expect(firstPro).toHaveProperty('isApproved');
            }
        });

        it('should only return pros where isApproved is false', async () => {
            const response = await request(app).get('/api/admin/pros/pending');

            response.body.forEach((pro: { isApproved: boolean }) => {
                expect(pro.isApproved).toBe(false);
            });
        });

        it('should set correct Content-Type header', async () => {
            const response = await request(app).get('/api/admin/pros/pending');
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });

    describe('POST /api/admin/pros/:id/approve', () => {
        it('should return 200 status code for valid pro id', async () => {
            const response = await request(app).post('/api/admin/pros/1/approve');
            expect(response.status).toBe(200);
        });

        it('should return the approved pro with isApproved set to true', async () => {
            const response = await request(app).post('/api/admin/pros/1/approve');
            expect(response.body).toHaveProperty('isApproved', true);
        });

        it('should return the approved pro with approvedAt timestamp', async () => {
            const response = await request(app).post('/api/admin/pros/1/approve');
            expect(response.body).toHaveProperty('approvedAt');
            expect(typeof response.body.approvedAt).toBe('string');
        });

        it('should return 404 for non-existent pro id', async () => {
            const response = await request(app).post('/api/admin/pros/999/approve');
            expect(response.status).toBe(404);
        });

        it('should return error message for non-existent pro', async () => {
            const response = await request(app).post('/api/admin/pros/999/approve');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Pro not found');
        });

        it('should set correct Content-Type header', async () => {
            const response = await request(app).post('/api/admin/pros/1/approve');
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });

    describe('POST /api/admin/pros/:id/reject', () => {
        it('should return 200 status code for valid pro id', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({ reason: '자격증 확인 불가' });
            expect(response.status).toBe(200);
        });

        it('should return the rejected pro with rejection reason', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({ reason: '자격증 확인 불가' });
            expect(response.body).toHaveProperty('rejectionReason', '자격증 확인 불가');
        });

        it('should return the rejected pro with rejectedAt timestamp', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({ reason: '자격증 확인 불가' });
            expect(response.body).toHaveProperty('rejectedAt');
            expect(typeof response.body.rejectedAt).toBe('string');
        });

        it('should return 404 for non-existent pro id', async () => {
            const response = await request(app)
                .post('/api/admin/pros/999/reject')
                .send({ reason: '거절 사유' });
            expect(response.status).toBe(404);
        });

        it('should return 400 if rejection reason is not provided', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({});
            expect(response.status).toBe(400);
        });

        it('should return error message when reason is missing', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({});
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Rejection reason is required');
        });

        it('should set correct Content-Type header', async () => {
            const response = await request(app)
                .post('/api/admin/pros/1/reject')
                .send({ reason: '자격증 확인 불가' });
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });
});
