const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows: topics }) => {
            return topics;
        })
};

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles`)
        .then(({ rows: articles }) => {
            return articles;
        })
};