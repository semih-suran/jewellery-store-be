const db = require("../db/connection");

const createUser = async (user) => {
  const { first_name, last_name, nickname, email, password } = user;
  const result = await db.query(
    `INSERT INTO shopping_users (first_name, last_name, nickname, email, password)
    VALUES ($1, $2, $3, $4, $5)
     RETURNING *;`,
    [first_name, last_name, nickname, email, password]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
};
