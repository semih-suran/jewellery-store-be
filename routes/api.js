const express = require("express");
const apiRouter = express.Router();
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
} = require("../controllers");

const endpointMapping = {
  "/topics": getAllTopics,
  "/comments": getAllCommentsByLifo,
  "/articles": (req, res, next) => {
    if (req.query.topic) {
      return getArticlesByTopicQuery(req, res, next);
    } else if (Object.keys(req.query).length > 0) {
      return getAllArticlesBySortQuery(req, res, next);
    } else {
      return getAllArticlesByLifo(req, res, next);
    }
  },
  "/articles/:article_id": getArticleById,
  "/articles/:article_id/comments": getCommentsByArticleIdLifo,
  "/users": getAllUsers,
  "/users/:username/makeDefault": setUserAsDefault,
  "/articles/:article_id/comments": postCommentToArticle,
  "/articles/:article_id": patchArticleVotes,
  "/comments/:comment_id": deleteComment,
};

Object.keys(endpointMapping).forEach((path) => {
  const handler = endpointMapping[path];
  apiRouter.route(path).get(handler).patch(handler).post(handler).delete(handler);
});

apiRouter.get("/", getAllEndpoints);

module.exports = apiRouter;
