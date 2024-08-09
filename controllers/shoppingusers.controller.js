const {
  fetchAllShoppingUsers,
  fetchShoppingUserById,
  createShoppingUser,
  updateShoppingUserAddress,
  updateShoppingUserNickname,
} = require("../models/shoppingusers.model");

const getAllShoppingUsers = async (req, res, next) => {
  try {
    const users = await fetchAllShoppingUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getShoppingUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await fetchShoppingUserById(user_id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const postShoppingUser = async (req, res, next) => {
  try {
    const {
      firstName: first_name,
      lastName: last_name,
      nickname,
      email,
      password,
      picture,
      mobilePhone: mobile_phone,
      street,
      city,
      state,
      zipCode: zipcode,
      country,
    } = req.body;

    const user = {
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
    };

    const createdUser = await createShoppingUser(user);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

const patchShoppingUserAddress = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const address = req.body;
    const updatedUser = await updateShoppingUserAddress(user_id, address);
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const patchShoppingUserNickname = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { nickname } = req.body;
    const updatedUser = await updateShoppingUserNickname(user_id, nickname);
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllShoppingUsers,
  getShoppingUserById,
  postShoppingUser,
  patchShoppingUserAddress,
  patchShoppingUserNickname,
};
