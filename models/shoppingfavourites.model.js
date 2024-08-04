const db = require("../db/connection");

const fetchFavourites = async (user_id) => {
  const result = await db.query(`SELECT * FROM favourites WHERE user_id = $1`, [
    user_id,
  ]);
  return result.rows;
};

const addFavourite = async (user_id, item_id) => {
  const result = await db.query(
    `INSERT INTO favourites (user_id, item_id) VALUES ($1, $2) RETURNING *`,
    [user_id, item_id]
  );
  return result.rows[0];
};

const removeFavourite = async (user_id, item_id) => {
  await db.query(`DELETE FROM favourites WHERE user_id = $1 AND item_id = $2`, [
    user_id,
    item_id,
  ]);
};

module.exports = {
  fetchFavourites,
  addFavourite,
  removeFavourite,
};
