const { getTopics, getArticles, getArticleById, getArticleComments, postComment } = require('./controllers/controllers');
const express = require('express');
const app = express();
const {
  serverErrorHandler,
  invalidPathHandler,
  badRequestHandler,
  invalidEndPointHandler,
} = require("./errors.js");

app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);


app.all('*', invalidPathHandler);

app.use(invalidEndPointHandler);
app.use(badRequestHandler);

app.use(serverErrorHandler);



module.exports = app;