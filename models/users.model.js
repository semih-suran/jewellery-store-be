const db = require("../db/connection");
const fetchAllUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

const makeUserDefault = (username) => {
  const resetDefault = `UPDATE users SET is_default = FALSE WHERE is_default = TRUE`;
  const updateUser = `UPDATE users SET is_default = TRUE WHERE username = $1 RETURNING *`;

  return db.query(resetDefault)
    .then(() => db.query(updateUser, [username]))
    .then(result => result.rows[0]);
};

module.exports = { fetchAllUsers, makeUserDefault };
