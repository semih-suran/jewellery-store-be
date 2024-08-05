const { createUser } = require("../models/shoppinguserauth.model");

const registerUser = (req, res, next) => {
  const user = req.body;
  createUser(user)
    .then((createdUser) => {
      res.status(201).json({ user: createdUser });
    })
    .catch(next);
};

module.exports = {
  registerUser,
};
