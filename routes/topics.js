const express = require('express');
const {getTopics} = require("../controllers/controllers");

const topicsRouter = express.Router();

topicsRouter.get("/topics", getTopics);


module.exports = topicsRouter;