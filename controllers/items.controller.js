const items = require("../db/data/development-data/items");

const getAllItems = (req, res, next) => {
  res.status(200).json({ items });
};

module.exports = { getAllItems };
