const {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticle,
} = require("./controllers/controllers");

const express = require("express");

const app = express();

const {
  serverErrorHandler,
  invalidPathHandler,
  badRequestHandler,
  invalidEndPointHandler,
} = require("./errors.js");

const topicsRouter = require("./routes/topics.js");
// const apiArticlesRouter = require("./routes/api.articles");

const cors = require("cors");

app.use(express.json());

app.use(cors());

//app.use("/api/topics", topicsRouter);
// app.use("/api/articles", apiArticlesRouter);

//GET /api/topics
app.get("/api/topics", getTopics);

//GET /api/articles
app.get("/api/articles", getArticles);

//GET /api/articles/:article_id
app.get("/api/articles/:article_id", getArticleById);

//GET /api/articles/:article_id/comments
app.get("/api/articles/:article_id/comments", getArticleComments);
//POST /api/articles/:article_id/comments
app.post("/api/articles/:article_id/comments", postComment);

//PATCH /api/articles/:article_id
app.patch("/api/articles/:article_id", patchArticle);

//GET /*
app.all("*", invalidPathHandler);

// invalid end point handler
app.use(invalidEndPointHandler);

// invalid request handler
app.use(badRequestHandler);

// 505 handler
app.use(serverErrorHandler);

module.exports = app;
