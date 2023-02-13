const db = require('../db/connection');

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticles = (topic, sort_by, order_by) => {
  if (!topic) {
    return db
      .query(
        `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by} ${order_by}`
      )
      .then(({ rows: articles }) => {
        return articles;
      });
  }

  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      WHERE articles.topic = $1
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by} DESC`,
      [topic]
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [articleId]
    )
    .then(({ rows: article }) => {
      if (!article[0]) {
        return Promise.reject();
      }
      console.log(article[0]);
      return article[0];
    });
};

exports.checkArticleExists = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [articleId]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject();
      }
      return true;
    });
};

exports.selectArticleComments = (articleId) => {
  return db
    .query(
      `SELECT * 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC `,
      [articleId]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.insertComment = (articleId, author, body) => {
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
      [articleId, author, body]
    )
    .then(({ rows: comment }) => {
      return { comment: comment[0] };
    });
};

exports.updateArticle = (articleId, voteInc) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [voteInc, articleId]
    )
    .then(({ rows: article }) => {
      return article[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

// exports.deleteCommentById = () => {

// }
