const db = require("../db/connection");

const fetchArticleById = async (articleId) => {
  if (isNaN(articleId)) {
    throw {
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    };
  }
  const result = await db.query(
    `
    SELECT
      articles.article_id,
      articles.author,
      articles.title,
      articles.body,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM
      articles
    LEFT JOIN
      comments ON articles.article_id = comments.article_id
    WHERE
      articles.article_id = $1
    GROUP BY
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.body,
      articles.votes,
      articles.article_img_url;
  `,
    [articleId]
  );
  return result.rows;
};

const fetchArticlesWithCommentCount = async () => {
  const result = await db.query(`
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM
      articles
    LEFT JOIN
      comments ON articles.article_id = comments.article_id
    GROUP BY
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY
      articles.created_at DESC;
  `);
  return result.rows;
};

const checkIfArticleExists = async (articleId) => {
  if (isNaN(articleId)) {
    throw {
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    };
  }
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [articleId]
  );
  return result.rows.length > 0;
};

const patchVotes = async (articleId, inc_votes) => {
  if (isNaN(articleId)) {
    throw {
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    };
  }
  await db.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS votes INT;`);
  const result = await db.query(
    `UPDATE articles SET votes = COALESCE(votes, 0) + $2 WHERE article_id = $1 RETURNING *;`,
    [articleId, inc_votes]
  );
  return result.rows;
};

const fetchArticlesByTopic = async (topic) => {
  const topicResult = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
    topic,
  ]);
  if (topicResult.rows.length === 0) {
    throw { status: 404, msg: "(topic) does not exist." };
  }
  const result = await db.query(`SELECT * FROM articles WHERE topic = $1`, [
    topic,
  ]);
  return result.rows;
};

module.exports = {
  fetchArticleById,
  fetchArticlesWithCommentCount,
  patchVotes,
  checkIfArticleExists,
  fetchArticlesByTopic,
};
