const db = require("../db/connection");

const fetchItems = async () => {
  const result = await db.query("SELECT * FROM items;");
  return result.rows;
};

const fetchItemById = async (item_id) => {
  const result = await db.query("SELECT * FROM items WHERE item_id = $1;", [
    item_id,
  ]);
  return result.rows[0];
};

const fetchItemsByType = async (type) => {
  const result = await db.query("SELECT * FROM items WHERE type = $1;", [type]);
  return result.rows;
};

const fetchItemsByStyle = async (style) => {
  const result = await db.query("SELECT * FROM items WHERE style = $1;", [
    style,
  ]);
  return result.rows;
};

const fetchItemsBySize = async (size) => {
  const result = await db.query("SELECT * FROM items WHERE size = $1;", [size]);
  return result.rows;
};

const fetchItemsByColor1 = async (color1) => {
  const result = await db.query("SELECT * FROM items WHERE color1 = $1;", [
    color1,
  ]);
  return result.rows;
};

const fetchItemsByColor2 = async (color2) => {
  const result = await db.query("SELECT * FROM items WHERE color2 = $1;", [
    color2,
  ]);
  return result.rows;
};

const updateReviewScore = async (item_id, review_score) => {
  const result = await db.query(
    "UPDATE items SET review_score = $2, updated_at = NOW() WHERE item_id = $1 RETURNING *;",
    [item_id, review_score]
  );
  return result.rows[0];
};

const updateQuantity = async (item_id, quantity) => {
  const result = await db.query(
    "UPDATE items SET quantity = $2, updated_at = NOW() WHERE item_id = $1 RETURNING *;",
    [item_id, quantity]
  );
  return result.rows[0];
};

const updateLikes = async (item_id, likes) => {
  const result = await db.query(
    "UPDATE items SET likes = $2, updated_at = NOW() WHERE item_id = $1 RETURNING *;",
    [item_id, likes]
  );
  return result.rows[0];
};

const updateInBasket = async (item_id, in_basket) => {
  const result = await db.query(
    "UPDATE items SET in_basket = $2, updated_at = NOW() WHERE item_id = $1 RETURNING *;",
    [item_id, in_basket]
  );
  return result.rows[0];
};

module.exports = {
  fetchItems,
  fetchItemById,
  fetchItemsByType,
  fetchItemsByStyle,
  fetchItemsBySize,
  fetchItemsByColor1,
  fetchItemsByColor2,
  updateReviewScore,
  updateQuantity,
  updateLikes,
  updateInBasket,
};
