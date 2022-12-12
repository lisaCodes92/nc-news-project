const {getTopics} = require('./controllers/controllers')
const express = require('express');
const app = express();
const { serverErrorHandler, invalidPathHandler } = require("./errors.js");

app.get('/api/topics', getTopics);

app.use(invalidPathHandler);
app.use(serverErrorHandler);


module.exports = app;