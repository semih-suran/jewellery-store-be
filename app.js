const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const { getAllItems } = require("./controllers/items.controller");
const { getAllTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/endpoints.controller");
const {
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
} = require("./controllers/articles.controller");
const {
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
} = require("./controllers/comments.controller");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");
const {
  getAllUsers,
  setUserAsDefault,
} = require("./controllers/users.controller");

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

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
