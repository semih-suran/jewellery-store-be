require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const errorHandlers = require("./error-handlers");
const {
  getAllTopics,
  getAllEndpoints,
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
  getAllUsers,
  setUserAsDefault,
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
  getShoppingBagHandler,
  addShoppingBagItemHandler,
  removeShoppingBagItemHandler,
  getFavouritesHandler,
  addFavouriteHandler,
  removeFavouriteHandler,
  getReviewsHandler,
  postReviewHandler,
  deleteReviewHandler,
} = require("./controllers");

app.use(express.json());
app.use(cors());

app.use(errorHandlers.psqlErrorHandler);
app.use(errorHandlers.customErrorHandler);
app.use(errorHandlers.serverErrorHandler);

// Articles Routes
app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/comments", getAllCommentsByLifo);

app.get("/api/articles", (req, res, next) => {
  if (req.query.topic) {
    return getArticlesByTopicQuery(req, res, next);
  } else if (Object.keys(req.query).length > 0) {
    return getAllArticlesBySortQuery(req, res, next);
  } else {
    return getAllArticlesByLifo(req, res, next);
  }
});

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleIdLifo);
app.post("/api/articles/:article_id/comments", postCommentToArticle);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);
app.patch("/api/users/:username/makeDefault", setUserAsDefault);

// Items Routes
app.get("/api/items", getAllItems);
app.get("/api/items/:item_id", getItemById);
app.get("/api/items/type/:type", getItemsByType);
app.get("/api/items/style/:style", getItemsByStyle);
app.get("/api/items/size/:size", getItemsBySize);
app.get("/api/items/color1/:color1", getItemsByColor1);
app.get("/api/items/color2/:color2", getItemsByColor2);
app.get("/api/search", searchItems);
app.get("/api/shoppingusers", getAllShoppingUsers);
app.get("/api/shoppingusers/:user_id", getShoppingUserById);

app.patch("/api/shoppingusers/:user_id/address", patchShoppingUserAddress);
app.patch("/api/shoppingusers/:user_id/nickname", patchShoppingUserNickname);
app.patch("/api/items/:item_id/review_score", patchReviewScore);
app.patch("/api/items/:item_id/quantity", patchQuantity);
app.patch("/api/items/:item_id/likes", patchLikes);
app.patch("/api/items/:item_id/in_basket", patchInBasket);

app.post("/api/shoppingusers", postShoppingUser);
app.post("/create-payment-intent", postPaymentIntent);

// Shopping Bag Routes
app.get("/api/shoppingbag/:user_id", getShoppingBagHandler);
app.post("/api/shoppingbag", addShoppingBagItemHandler);
app.delete("/api/shoppingbag/:user_id/:item_id", removeShoppingBagItemHandler);

// Favourites Routes
app.get("/api/favourites/:user_id", getFavouritesHandler);
app.post("/api/favourites", addFavouriteHandler);
app.delete("/api/favourites/:user_id/:item_id", removeFavouriteHandler);

// Reviews Routes
app.get("/api/reviews/:item_id", getReviewsHandler);
app.post("/api/reviews", postReviewHandler);
app.delete("/api/reviews/:review_id", deleteReviewHandler);

module.exports = app;
