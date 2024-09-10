const {
    fetchAllCuratorusers,
    fetchCuratoruserById,
    createCuratoruser,
    updateCuratoruserAddress,
    updateCuratoruserNickname,
  } = require("../models/curator-users.model");
  
  const getAllCuratorusers = async (req, res, next) => {
    try {
      const users = await fetchAllCuratorusers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
  
  const getCuratoruserById = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const user = await fetchCuratoruserById(user_id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
  
  const postCuratoruser = async (req, res, next) => {
    try {
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
      } = req.body;
  
      const user = {
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
      };
  
      const createdUser = await createCuratoruser(user);
      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  };
  
  const patchCuratoruserAddress = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const address = req.body;
      const updatedUser = await updateCuratoruserAddress(user_id, address);
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  
  const patchCuratoruserNickname = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { nickname } = req.body;
      const updatedUser = await updateCuratoruserNickname(user_id, nickname);
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    getAllCuratorusers,
    getCuratoruserById,
    postCuratoruser,
    patchCuratoruserAddress,
    patchCuratoruserNickname,
  };
  