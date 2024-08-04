const {
  fetchFavourites,
  addFavourite,
  removeFavourite,
} = require("../models/shoppingfavourites.model");

const getFavouritesHandler = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const favourites = await fetchFavourites(user_id);
    res.status(200).send({ favourites });
  } catch (err) {
    next(err);
  }
};

const addFavouriteHandler = async (req, res, next) => {
  const { user_id, item_id } = req.body;
  try {
    const favourite = await addFavourite(user_id, item_id);
    res.status(201).send({ favourite });
  } catch (err) {
    next(err);
  }
};

const removeFavouriteHandler = async (req, res, next) => {
  const { user_id, item_id } = req.params;
  try {
    await removeFavourite(user_id, item_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavouritesHandler,
  addFavouriteHandler,
  removeFavouriteHandler,
};
