const db = require("../db/connection");

const fetchShoppingBagItems = async (userId) => {
  const result = await db.query(
    `SELECT * FROM shopping_bag WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

const addItemToShoppingBag = async (userId, itemId, quantity) => {
  const existingItem = await db.query(
    `SELECT * FROM shopping_bag WHERE user_id = $1 AND item_id = $2`,
    [userId, itemId]
  );

  if (existingItem.rows.length > 0) {
    const updatedItem = await db.query(
      `UPDATE shopping_bag SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3 RETURNING *`,
      [quantity, userId, itemId]
    );
    return updatedItem.rows[0];
  } else {
    const newItem = await db.query(
      `INSERT INTO shopping_bag (user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [userId, itemId, quantity]
    );
    return newItem.rows[0];
  }
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
