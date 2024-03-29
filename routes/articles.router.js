const express = require("express");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticle,
  removeCommentById,
} = require("../controllers/controllers");

const articlesRouter = express.Router();

articlesRouter
  .get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);



module.exports = articlesRouter;
