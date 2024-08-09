const db = require("../db/connection");
const bcrypt = require("bcrypt");

const createUser = async (user) => {
  const {
    first_name,
    last_name,
    nickname,
    email,
    googleId,
    picture = "https://www.shareicon.net/data/128x128/2016/05/24/770107_man_512x512.png",
  } = user;
  const password = googleId || (await bcrypt.hash(user.password, 10));
  const result = await db.query(
    `INSERT INTO shopping_users (first_name, last_name, nickname, email, password, picture)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [first_name, last_name, nickname, email, password, picture]
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
