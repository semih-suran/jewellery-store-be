const db = require("../db/connection");

const fetchShoppingBagItems = async (userId) => {
  const result = await db.query(
    `SELECT * FROM shopping_bag WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

const addItemToShoppingBag = async (userId, itemId, quantity) => {
  const result = await db.query(
    `INSERT INTO shopping_bag (user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
    [userId, itemId, quantity]
  );
  return result.rows[0];
};

const removeItemFromShoppingBag = async (userId, itemId) => {
  await db.query(
    `DELETE FROM shopping_bag WHERE user_id = $1 AND item_id = $2`,
    [userId, itemId]
  );
};

module.exports = {
  fetchShoppingBagItems,
  addItemToShoppingBag,
  removeItemFromShoppingBag,
};
