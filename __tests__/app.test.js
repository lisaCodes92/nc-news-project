const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection');
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('/api/topics', () => {
    describe('GET', () => {
        it('returns an array of topics that contain a description and a slug property', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).toHaveLength(3);
                    topics.forEach((topic) => {
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    });
            })
        });
    });
});

describe('Error handlers', () => {
    describe('404 - path not found', () => {
        it('returns an error code of 404 when passed an invalid path', () => {
            return request(app)
                .get('/api/cakes')
                .expect(404)
                .then(({ body }) => {
                expect(body.msg).toBe("No Such Path");
            })
        });
    });
});