const {
    selectTopics,
    selectArticles,
    selectArticleById,
    checkArticleExists,
    selectArticleComments,
    insertComment,
    updateArticle,
    selectUsers,
} = require('../models/models.js');

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

    checkArticleExists(articleId)
        .then(() => {
           return selectArticleComments(articleId)
        })
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        })
};

exports.postComment = (req, res, next) => {
    const articleId = req.params.article_id;
    const author = req.body.author;
    const body = req.body.body;

    checkArticleExists(articleId)
        .then(() => {
            return insertComment(articleId, author, body)
        })
        .then((comment) => {
            res.status(201).send(comment);
        })
        .catch((err) => {
            next(err);
        })
};

exports.patchArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const voteInc = req.body.inc_votes;

    checkArticleExists(articleId)
        .then(() => {
            return updateArticle(articleId, voteInc)
        })
        .then((article) => {
            res.status(200).send(article);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
        res.status(200).send({ users });
      })
      .catch((err) => {
        next(err);
      });
};