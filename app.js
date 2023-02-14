const express = require('express');
const {
  serverErrorHandler,
  invalidPathHandler,
  badRequestHandler,
  invalidEndPointHandler,
} = require('./errors.js');
const apiRouter = require('./routes/api.router');
const app = express();
const data = require('./endpoints.json')

app.use(express.json());

app.get('/api', (req, res,) => {
  res.json(data);
})

app.use('/api', apiRouter);

const cors = require('cors');
app.use(cors());


app.all('*', invalidPathHandler);

app.use(invalidEndPointHandler);

app.use(badRequestHandler);

app.use(serverErrorHandler);

module.exports = app;
