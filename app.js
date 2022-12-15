const { getTopics, getArticles, getArticleById, getArticleComments } = require('./controllers/controllers');
const express = require('express');
const app = express();
const {
  serverErrorHandler,
  invalidPathHandler,
  badRequestHandler,
} = require("./errors.js");


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);


app.all('*', invalidPathHandler);

app.use(badRequestHandler);
app.use(serverErrorHandler);


module.exports = app;