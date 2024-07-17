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

const { getAllEndpoints } = require("./endpoints.controller");

const {
  getAllItems,
  getItemsByType,
  searchItemsByQuery,
} = require("./items.controller");

const { getAllTopics } = require("./topics.controller");

const { getAllUsers, setUserAsDefault } = require("./users.controller");

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
  getAllItems,
  getItemsByType,
  getAllTopics,
  getAllUsers,
  setUserAsDefault,
  getAllEndpoints,
};
