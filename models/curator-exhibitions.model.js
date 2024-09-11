const db = require("../db/connection");

const addMyExhibition = async (exhibition) => {
  const {
    user_id,
    title,
    date,
    location,
    description,
    font,
    background,
    exhibitions,
  } = exhibition;

  const result = await db.query(
    `INSERT INTO curator_exhibitions (user_id, title, date, location, description, font, background, exhibitions, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *;`,
    [user_id, title, date, location, description, font, background, exhibitions]
  );

  return result.rows[0];
};

const fetchAllExhibitions = async () => {
  const result = await db.query("SELECT * FROM curator_exhibitions;");
  return result.rows;
};

const fetchExhibitionsByUser = async (user_id) => {
  const result = await db.query(
    "SELECT * FROM curator_exhibitions WHERE user_id = $1;",
    [user_id]
  );
  return result.rows;
};

const fetchExhibitionById = async (id) => {
  const result = await db.query(
    "SELECT * FROM curator_exhibitions WHERE id = $1;",
    [id]
  );
  return result.rows[0];
};

const updateExhibitionById = async (id, updatedExhibition) => {
  const { title, date, location, description, font, background, exhibitions } =
    updatedExhibition;
  const result = await db.query(
    `UPDATE curator_exhibitions
     SET title = $2, date = $3, location = $4, description = $5, font = $6, background = $7, exhibitions = $8, updated_at = NOW()
     WHERE id = $1
     RETURNING *;`,
    [id, title, date, location, description, font, background, exhibitions]
  );

  return result.rows[0];
};

const deleteExhibitionById = async (id) => {
  const result = await db.query(
    "DELETE FROM curator_exhibitions WHERE id = $1 RETURNING *;",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  addMyExhibition,
  fetchAllExhibitions,
  fetchExhibitionsByUser,
  fetchExhibitionById,
  updateExhibitionById,
  deleteExhibitionById,
};
