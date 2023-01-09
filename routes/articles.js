const express = require('express');
const { getArticles } = require('../controllers/controllers');

const apiArticlesRouter = express.Router();

apiArticlesRouter.get("api/articles", getArticles);

module.exports = apiArticlesRouter;