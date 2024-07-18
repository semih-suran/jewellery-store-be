require("dotenv").config();
const express = require("express");
const cors = require('cors');
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

app.patch("/api/items/:item_id/review_score", patchReviewScore);
app.patch("/api/items/:item_id/quantity", patchQuantity);
app.patch("/api/items/:item_id/likes", patchLikes);
app.patch("/api/items/:item_id/in_basket", patchInBasket);

module.exports = app;
