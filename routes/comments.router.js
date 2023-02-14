const express = require("express");
const {
  removeCommentById,
} = require("../controllers/controllers");

const commentsRouter = express.Router();

commentsRouter.route("/:comment_id")
    .delete(removeCommentById);

module.exports = commentsRouter;