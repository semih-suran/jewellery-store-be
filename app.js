require("dotenv").config();
const express = require("express");
const cors = require("cors");
const winston = require("winston");
const app = express();
const itemsRouter = require("./routes/items.router");
const apiRouter = require("./routes/api");
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
  getItemsByType,
} = require("./controllers");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

app.use(express.json());
app.use(cors());
app.use("/api/items", itemsRouter);
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  logger.error(err.message);
  console.error(err);
  next(err);
});

app.use(errorHandlers.psqlErrorHandler);
app.use(errorHandlers.customErrorHandler);
app.use(errorHandlers.serverErrorHandler);

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

app.get("/api/users", getAllUsers);

app.patch("/api/users/:username/makeDefault", setUserAsDefault);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/items", getAllItems);

app.get("/api/items/type/:type", getItemsByType);


module.exports = app;
