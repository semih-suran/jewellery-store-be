const db = require("../db/connection");
const bcrypt = require("bcrypt");

const createUser = async (user) => {
  const { first_name, last_name, nickname, email, googleId } = user;
  const password = googleId || (await bcrypt.hash(user.password, 10));
  const result = await db.query(
    `INSERT INTO shopping_users (first_name, last_name, nickname, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`,
    [first_name, last_name, nickname, email, password]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM shopping_users WHERE email = $1;`,
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
