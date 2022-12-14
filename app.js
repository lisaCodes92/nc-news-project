const { getTopics, getArticles, getArticleById } = require('./controllers/controllers');
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


app.all('*', invalidPathHandler);

app.use(badRequestHandler);
app.use(serverErrorHandler);


module.exports = app;