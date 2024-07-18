const {
  fetchItems,
  fetchItemById,
  fetchItemsByType,
  fetchItemsByStyle,
  fetchItemsBySize,
  fetchItemsByColor1,
  fetchItemsByColor2,
  updateReviewScore,
  updateQuantity,
  updateLikes,
  updateInBasket,
} = require("../models/items.model");

const getAllItems = (req, res, next) => {
  fetchItems()
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const getItemById = (req, res, next) => {
  const { item_id } = req.params;
  fetchItemById(item_id)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
};

const getItemsByType = (req, res, next) => {
  const { type } = req.params;
  fetchItemsByType(type)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const getItemsByStyle = (req, res, next) => {
  const { style } = req.params;
  fetchItemsByStyle(style)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const getItemsBySize = (req, res, next) => {
  const { size } = req.params;
  fetchItemsBySize(size)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const getItemsByColor1 = (req, res, next) => {
  const { color1 } = req.params;
  fetchItemsByColor1(color1)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const getItemsByColor2 = (req, res, next) => {
  const { color2 } = req.params;
  fetchItemsByColor2(color2)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};

const patchReviewScore = (req, res, next) => {
  const { item_id } = req.params;
  const { review_score } = req.body;
  updateReviewScore(item_id, review_score)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
};

const patchQuantity = (req, res, next) => {
  const { item_id } = req.params;
  const { quantity } = req.body;
  updateQuantity(item_id, quantity)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
};

const patchLikes = (req, res, next) => {
  const { item_id } = req.params;
  const { likes } = req.body;
  updateLikes(item_id, likes)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
};

const patchInBasket = (req, res, next) => {
  const { item_id } = req.params;
  const { in_basket } = req.body;
  updateInBasket(item_id, in_basket)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch(next);
};

// searchItemsByQuery To RELOGIC
const searchItemsByQuery = (req, res, next) => {
  const { color1 } = req.params;
  fetchItemsByColor1(color1)
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
};
// searchItemsByQuery To RELOGIC

module.exports = {
  getAllItems,
  getItemById,
  getItemsByType,
  getItemsByStyle,
  getItemsBySize,
  getItemsByColor1,
  getItemsByColor2,
  patchReviewScore,
  patchQuantity,
  patchLikes,
  patchInBasket,
  searchItemsByQuery,
};
