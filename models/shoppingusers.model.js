const db = require("../db/connection");
const bcrypt = require("bcrypt");

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const fetchAllShoppingUsers = async () => {
  const result = await db.query("SELECT * FROM shopping_users;");
  return result.rows.map((user) => {
    delete user.password;
    return user;
  });
};

const fetchShoppingUserById = async (user_id) => {
  const result = await db.query(
    "SELECT * FROM shopping_users WHERE user_id = $1;",
    [user_id]
  );
  const user = result.rows[0];
  if (user) delete user.password;
  return user;
};

const createShoppingUser = async (user) => {
  const {
    first_name,
    last_name,
    nickname,
    email,
    password,
    picture,
    mobile_phone,
    street,
    city,
    state,
    zipcode,
    country,
  } = user;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO shopping_users (first_name, last_name, nickname, email, password, picture, mobile_phone, street, city, state, zipcode, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *;`,
    [
      first_name,
      last_name,
      nickname,
      email,
      hashedPassword,
      picture,
      mobile_phone,
      street,
      city,
      state,
      zipcode,
      country,
    ]
  );

  const createdUser = result.rows[0];
  delete createdUser.password;
  return createdUser;
};

const updateShoppingUserAddress = async (user_id, address) => {
  const { street, city, state, zipCode, country } = address;
  const result = await db.query(
    `UPDATE shopping_users SET street = $2, city = $3, state = $4, zipcode = $5, country = $6, updated_at = NOW()
    WHERE user_id = $1 RETURNING *;`,
    [user_id, street, city, state, zipCode, country]
  );
  const updatedUser = result.rows[0];
  if (updatedUser) delete updatedUser.password;
  return updatedUser;
};

const updateShoppingUserNickname = async (user_id, nickname) => {
  const result = await db.query(
    `UPDATE shopping_users SET nickname = $2, updated_at = NOW() WHERE user_id = $1 RETURNING *;`,
    [user_id, nickname]
  );
  const updatedUser = result.rows[0];
  if (updatedUser) delete updatedUser.password;
  return updatedUser;
};

module.exports = {
  fetchAllShoppingUsers,
  fetchShoppingUserById,
  createShoppingUser,
  updateShoppingUserAddress,
  updateShoppingUserNickname,
  comparePassword,
};
