const {
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
} = require("./articles.controller");

const {
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
} = require("./comments.controller");

const {
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
  searchItems,
} = require("./items.controller");

const {
  getAllShoppingUsers,
  getShoppingUserById,
  postShoppingUser,
  patchShoppingUserAddress,
  patchShoppingUserNickname,
} = require("./shoppingusers.controller");

const {
  getShoppingBagHandler,
  addShoppingBagItemHandler,
  removeShoppingBagItemHandler,
} = require("./shoppingbag.controller");

const {
  getReviewsHandler,
  postReviewHandler,
  deleteReviewHandler,
} = require("./shoppingreviews.controller");

const {
  getFavouritesHandler,
  addFavouriteHandler,
  removeFavouriteHandler,
} = require("./shoppingfavourites.controller");

const { getAllEndpoints } = require("./endpoints.controller");

const { getAllTopics } = require("./topics.controller");

const { getAllUsers, setUserAsDefault } = require("./users.controller");

const { postPaymentIntent } = require("./postPaymentIntent.controller");

module.exports = {
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
  getAllTopics,
  getAllUsers,
  setUserAsDefault,
  getAllEndpoints,
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
  searchItems,
  getAllShoppingUsers,
  getShoppingUserById,
  postShoppingUser,
  patchShoppingUserAddress,
  patchShoppingUserNickname,
  postPaymentIntent,
  addFavouriteHandler,
  getFavouritesHandler,
  removeFavouriteHandler,
  getReviewsHandler,
  postReviewHandler,
  deleteReviewHandler,
  getReviewsHandler,
  postReviewHandler,
  deleteReviewHandler,
  getShoppingBagHandler,
  addShoppingBagItemHandler,
  removeShoppingBagItemHandler,
};
