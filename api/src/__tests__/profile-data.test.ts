import { profileLibrary } from '../profile-data';

describe('Profile Data Library', () => {
    it('should contain profile data', () => {
        expect(Object.keys(profileLibrary).length).toBeGreaterThan(0);
    });

    it('should have valid profile structure', () => {
        const firstSlug = Object.keys(profileLibrary)[0];
        const profile = profileLibrary[firstSlug];

        expect(profile).toHaveProperty('profile');
        expect(profile.profile).toHaveProperty('name');
        expect(profile.profile).toHaveProperty('title');
        expect(profile.profile).toHaveProperty('heroImage');
    });

    it('should have unique slugs', () => {
        const slugs = Object.keys(profileLibrary);
        const uniqueSlugs = new Set(slugs);
        expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have non-empty names for all profiles', () => {
        Object.values(profileLibrary).forEach((profile) => {
            expect(profile.profile.name).toBeTruthy();
            expect(profile.profile.name.length).toBeGreaterThan(0);
        });
    });

    it('should have valid image URLs', () => {
        Object.values(profileLibrary).forEach((profile) => {
            expect(profile.profile.heroImage).toBeTruthy();
            expect(typeof profile.profile.heroImage).toBe('string');
        });
    });
});
