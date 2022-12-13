const { getTopics, getArticles } = require('./controllers/controllers');
const express = require('express');
const app = express();
const { serverErrorHandler, invalidPathHandler } = require("./errors.js");

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.use(invalidPathHandler);
app.use(serverErrorHandler);


module.exports = app;