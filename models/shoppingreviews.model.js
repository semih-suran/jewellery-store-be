const db = require("../db/connection");

const fetchReviews = async (item_id) => {
  const result = await db.query(`SELECT * FROM reviews WHERE item_id = $1`, [
    item_id,
  ]);
  return result.rows;
};

const addReview = async (user_id, item_id, rating, review) => {
  const result = await db.query(
    `INSERT INTO reviews (user_id, item_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, item_id, rating, review]
  );
  return result.rows[0];
};

const deleteReview = async (review_id) => {
  await db.query(`DELETE FROM reviews WHERE review_id = $1`, [review_id]);
};

module.exports = {
  fetchReviews,
  addReview,
  deleteReview,
};
