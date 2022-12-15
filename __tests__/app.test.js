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
// GET
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
  describe('/api/articles/:article_id', () => {
    it('returns the requested article selected by id', () => {
      const ARTICLE_ID = 3;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect.objectContaining({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: 'mitch',
            created_at: '2020-11-03T09:12:00.000Z',
            votes: 0,
          });
      })
    });
  });
});
// Error Handlers
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
      it('returns 404 when passed a valid article id that is not in the database', () => {
        const ARTICLE_ID = 9999;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No Such Path");
          });
      });
      
    });
  describe('400 - bad request', () => {
    it('returns an error code of 404 when passed an invalid request', () => {
      const ARTICLE_ID = 'banana';
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
      })
    });
  });
});