const db = require("../db/connection");
const bcrypt = require("bcrypt");

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const fetchAllCuratorusers = async () => {
  const result = await db.query("SELECT * FROM curator_users;");
  return result.rows.map((user) => {
    delete user.password;
    return user;
  });
};

const fetchCuratoruserById = async (id) => {
  const result = await db.query("SELECT * FROM curator_users WHERE id = $1;", [
    id,
  ]);
  const user = result.rows[0];
  if (user) delete user.password;
  return user;
};

const createCuratoruser = async (user) => {
  const {
    first_name,
    last_name,
    nickname,
    email,
    verified,
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
    `INSERT INTO curator_users (first_name, last_name, nickname, email, verified, password, picture, mobile_phone, street, city, state, zipcode, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *;`,
    [
      first_name,
      last_name,
      nickname,
      email,
      verified,
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

const updateCuratoruserAddress = async (id, address) => {
  const { street, city, state, zipCode, country } = address;
  const result = await db.query(
    `UPDATE curator_users SET street = $2, city = $3, state = $4, zipcode = $5, country = $6, updated_at = NOW()
    WHERE id = $1 RETURNING *;`,
    [id, street, city, state, zipCode, country]
  );
  const updatedUser = result.rows[0];
  if (updatedUser) delete updatedUser.password;
  return updatedUser;
};

const updateCuratoruserNickname = async (id, nickname) => {
  const result = await db.query(
    `UPDATE curator_users SET nickname = $2, updated_at = NOW() WHERE id = $1 RETURNING *;`,
    [id, nickname]
  );
  const updatedUser = result.rows[0];
  if (updatedUser) delete updatedUser.password;
  return updatedUser;
};

module.exports = {
  fetchAllCuratorusers,
  fetchCuratoruserById,
  createCuratoruser,
  updateCuratoruserAddress,
  updateCuratoruserNickname,
  comparePassword,
};
