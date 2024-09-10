const db = require("../db/connection");
const bcrypt = require("bcrypt");

const createUser = async (user) => {
  const {
    first_name,
    last_name,
    nickname,
    email,
    verified,
    googleId,
    picture = "https://www.shareicon.net/data/128x128/2016/05/24/770107_man_512x512.png",
  } = user;
  const password = googleId || (await bcrypt.hash(user.password, 10));
  const result = await db.query(
    `INSERT INTO curator_users (first_name, last_name, nickname, email, verified, password, picture)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *;`,
    [first_name, last_name, nickname, email, verified, password, picture]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM curator_users WHERE email = $1;`,
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
