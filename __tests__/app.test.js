const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET", () => {
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
    it("returns the articles sorted by date in decending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("returns the requested article selected by id", () => {
      const ARTICLE_ID = 3;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect.objectContaining({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          });
        });
    });
    it("returns 404 when passed a valid article id that is not in the database", () => {
      const ARTICLE_ID = 9999;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });

    it("returns an error code of 400 when passed an invalid request", () => {
      const ARTICLE_ID = "banana";
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    it("returns the requested article selected by id", () => {
      const ARTICLE_ID = 5;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 5,
            });
          });
        });
    });
    it("returns 200 and an empty array if no comments are attached to the passed article id", () => {
      const ARTICLE_ID = 2;

      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(0);
        });
    });
    it("returns the comments sorted by date in decending order", () => {
      const ARTICLE_ID = 3;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("returns an error code of 400 when passed an invalid request", () => {
      const ARTICLE_ID = "banana";
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 when passed a valid article id that is not in the database ", () => {
      const ARTICLE_ID = 9999;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("returns the new comment once it is added to the database", () => {
      const ARTICLE_ID = 2;
      const newComment = {
        author: "butter_bridge",
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              article_id: 2,
              author: "butter_bridge",
              body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
              votes: 0,
            })
          );
        });
    });
    it("ignores addtional values in th object", () => {
      const ARTICLE_ID = 4;
      const newComment = {
        author: "rogersop",
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
        extra_key: "I should not be here...",
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              article_id: 4,
              author: "rogersop",
              body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
              votes: 0,
            })
          );
        });
    });
    it("returns 400 when a required key is missing", () => {
      const ARTICLE_ID = 3;
      const newComment = {
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 400 when passed an invalid request", () => {
      const ARTICLE_ID = "happy holidays!";
      const newComment = {
        author: "lurker",
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 when passed a valid article id that is not in the database", () => {
      const ARTICLE_ID = 9999;
      const newComment = {
        author: "lurker",
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });
    it("returns 404 when username is not in the database", () => {
      const ARTICLE_ID = 1;
      const newComment = {
        author: "thisUserName",
        body: 'Two cups of coffee wake me up enough to ask "Did I have coffee?"',
      };
      return request(app)
        .post(`/api/articles/${ARTICLE_ID}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("PATCH", () => {
  describe("/api/articles/article_id", () => {
    it("returns updated article when votes is incremented", () => {
      const ARTICLE_ID = 2;
      const voteUpdate = {
        inc_votes: 3,
      }
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .send(voteUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(3);
        });
    });
    it("returns updated article when votes is decremented", () => {
      const ARTICLE_ID = 1;
      const voteUpdate = {
        inc_votes: -20,
      };
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .send(voteUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(80);
        });
    });
    it("returns 404 when passed a valid article id that is not in the database", () => {
      const ARTICLE_ID = 9999;
      const voteUpdate = {
        inc_votes: -20,
      };
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });
    it('returns 400 when passed an invalid key', () => {
      const ARTICLE_ID = 1;
      const voteUpdate = {
        votes: 12,
      };
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 400 when passed an invalid article id", () => {
      const ARTICLE_ID = 9999;
      const voteUpdate = {
        inc_votes: -20,
      };
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });
    it("returns 400 when incorrect value data type posted", () => {
      const ARTICLE_ID = 1;
      const voteUpdate = {
        inc_votes: 'bananas',
      };
      return request(app)
        .patch(`/api/articles/${ARTICLE_ID}`)
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Error handlers", () => {
  describe("404 - path not found", () => {
    it("returns an error code of 404 when passed an invalid path", () => {
      return request(app)
        .get("/api/cakes")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found...");
        });
    });
  });

  describe("400 - bad request", () => {
    it("returns an error code of 400 when passed an invalid request", () => {
      const ARTICLE_ID = "banana";
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
