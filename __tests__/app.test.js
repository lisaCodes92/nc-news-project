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

describe('GET', () => {
    describe("/api/topics", () => {
      it("returns an array of topics that contain a description and a slug property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("/api/articles", () => {
      it("returns an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String),
                })
              );
            });
          });
      });
      it('returns the articles sorted by date in decending order', () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', { descending: true });
          });
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