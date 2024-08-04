const {
  fetchShoppingBagItems,
  addItemToShoppingBag,
  removeItemFromShoppingBag,
} = require("../models/shoppingbag.model");

const getShoppingBagHandler = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const items = await fetchShoppingBagItems(user_id);
    res.status(200).send({ items });
  } catch (err) {
    next(err);
  }
};

const addShoppingBagItemHandler = async (req, res, next) => {
  const { user_id, item_id, quantity } = req.body;
  try {
    const item = await addItemToShoppingBag(user_id, item_id, quantity);
    res.status(201).send({ item });
  } catch (err) {
    next(err);
  }
};

const removeShoppingBagItemHandler = async (req, res, next) => {
  const { user_id, item_id } = req.params;
  try {
    await removeItemFromShoppingBag(user_id, item_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShoppingBagHandler,
  addShoppingBagItemHandler,
  removeShoppingBagItemHandler,
};
