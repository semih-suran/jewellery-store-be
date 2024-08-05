const db = require("../db/connection");
const bcrypt = require("bcrypt");

const fetchAllShoppingUsers = async () => {
  const result = await db.query("SELECT * FROM shopping_users;");
  return result.rows;
};

const fetchShoppingUserById = async (user_id) => {
  const result = await db.query(
    "SELECT * FROM shopping_users WHERE user_id = $1;",
    [user_id]
  );
  return result.rows[0];
};

const createShoppingUser = async (user) => {
  const {
    firstName,
    lastName,
    nickname,
    email,
    password,
    mobilePhone,
    street,
    city,
    state,
    zipCode,
    country,
  } = user;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO shopping_users (first_name, last_name, nickname, email, password, mobile_phone, street, city, state, zipCode, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;`,
    [
      firstName,
      lastName,
      nickname,
      email,
      hashedPassword,
      mobilePhone,
      street,
      city,
      state,
      zipCode,
      country,
    ]
  );
  return result.rows[0];
};

const updateShoppingUserAddress = async (user_id, address) => {
  const { street, city, state, zipCode, country } = address;
  const result = await db.query(
    `UPDATE shopping_users SET street = $2, city = $3, state = $4, zipCode = $5, country = $6, updated_at = NOW()
    WHERE user_id = $1 RETURNING *;`,
    [user_id, street, city, state, zipCode, country]
  );
  return result.rows[0];
};

const updateShoppingUserNickname = async (user_id, nickname) => {
  const result = await db.query(
    `UPDATE shopping_users SET nickname = $2, updated_at = NOW() WHERE user_id = $1 RETURNING *;`,
    [user_id, nickname]
  );
  return result.rows[0];
};

module.exports = {
  fetchAllShoppingUsers,
  fetchShoppingUserById,
  createShoppingUser,
  updateShoppingUserAddress,
  updateShoppingUserNickname,
};
