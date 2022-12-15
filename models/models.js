const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows: topics }) => {
            return topics;
        })
};

exports.selectArticles = () => {
    return db
      .query(
          `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, 
          COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments on comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`
      )
      .then(({ rows: articles }) => {
        return articles;
      });
};

exports.selectArticleById = (articleId) => {
  return db.query(`SELECT * FROM articles 
  WHERE article_id = $1;`, [articleId])
    .then(({ rows: article }) => {
      if(!article[0]){
        return Promise.reject();  
      }
      return article[0];
  })
}