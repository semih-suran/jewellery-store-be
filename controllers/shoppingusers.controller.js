const {
  fetchAllShoppingUsers,
  fetchShoppingUserById,
  createShoppingUser,
  updateShoppingUserAddress,
  updateShoppingUserNickname,
} = require("../models/shoppingusers.model");

const getAllShoppingUsers = (req, res, next) => {
  fetchAllShoppingUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
};

const getShoppingUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchShoppingUserById(user_id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
};

const postShoppingUser = (req, res, next) => {
  const user = req.body;
  createShoppingUser(user)
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch(next);
};

const patchShoppingUserAddress = (req, res, next) => {
  const { user_id } = req.params;
  const address = req.body;
  updateShoppingUserAddress(user_id, address)
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch(next);
};

const patchShoppingUserNickname = (req, res, next) => {
  const { user_id } = req.params;
  const { nickname } = req.body;
  updateShoppingUserNickname(user_id, nickname)
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch(next);
};

module.exports = {
  getAllShoppingUsers,
  getShoppingUserById,
  postShoppingUser,
  patchShoppingUserAddress,
  patchShoppingUserNickname,
};
