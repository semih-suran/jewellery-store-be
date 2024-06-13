const db = require("../db/connection");

const fetchAllCommentsByLifo = () => {
  return db
    .query(
      `
      SELECT * FROM
      comments
    ORDER BY
      created_at DESC;
  `
    )
    .then((result) => result.rows);
};

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((result) => result.rows);
};

const addCommentToArticle = async (articleId, username, body) => {
  const userResult = await db.query(
    `SELECT * FROM users WHERE username = $1;`,
    [username]
  );
  if (!username || !body) {
    throw {
      status: 400,
      msg: "(username) and (body) are required fields.",
    };
  }
  if (userResult.rows.length === 0) {
    throw { status: 404, msg: "(username) does not exist." };
  }

  const result = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
    [articleId, username, body]
  );

  return result.rows[0];
};

const checkIfCommentExists = (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid (comment_id) Format. Must Be a Number.",
    });
  }
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [commentId])
    .then((result) => result.rows.length > 0)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({
          status: 404,
          msg: "Non-existent Comment ID",
        });
      }
      return exists;
    });
};

const deleteCommentByCommentId = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [commentId])
    .then((result) => result.rows);
};

module.exports = {
  fetchAllCommentsByLifo,
  fetchCommentsByArticleId,
  addCommentToArticle,
  deleteCommentByCommentId,
  checkIfCommentExists,
};

