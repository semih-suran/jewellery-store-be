const { fetchAllUsers, makeUserDefault } = require("../models/users.model");

const getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch(next);
};

const setUserAsDefault = (req, res, next) => {
  const { username } = req.params;

  makeUserDefault(username)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send({ user });
  })
  .catch(next);
};

module.exports = { getAllUsers, setUserAsDefault };
