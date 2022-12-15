const { selectTopics, selectArticles, selectArticleById, selectArticleComments } = require('../models/models.js');

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;

    selectArticleById(articleId)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getArticleComments = (req, res, next) => {
    const articleId = req.params.article_id;

    selectArticleComments(articleId)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        })
};