const {
  fetchArticleById,
  fetchArticlesWithCommentCount,
  patchVotes,
  fetchArticlesByTopic,
} = require("../models/articles.model");

const { checkIfArticleExists } = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      res.status(200).send(article);
    })
    .catch(next);
};

const getAllArticlesByLifo = (req, res, next) => {
  fetchArticlesWithCommentCount()
    .then((articles) => {
      res.send(articles);
    })
    .catch(next);
};

const patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes, ...moreKeys } = req.body;

  checkIfArticleExists(articleId)
    .then((articleExists) => {
      if (!articleExists) {
        return res.status(404).send({ msg: "Non-existent Article ID" });
      }
      if (inc_votes === undefined && Object.keys(moreKeys).length > 0) {
        return res
          .status(400)
          .send({ msg: "(inc_votes) is required and should be the only key." });
      }
      return patchVotes(articleId, inc_votes);
    })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const getArticlesByTopicQuery = (req, res, next) => {
  const query = req.query.topic;
  if (!query) {
    return getAllArticlesByLifo(req, res, next);
  }
  fetchArticlesByTopic(query)
    .then((topics) => {
      res.send(topics);
    })
    .catch(next);
};

const getAllArticlesBySortQuery = (req, res, next) => {
  const { sort_by = "created_at", order = "desc" } = req.query;
  const validColumns = ["created_at", "author", "title", "votes", "comment_count", "topic", "article_id" ];
  const validOrders = ["asc", "desc"]

  if (!validOrders.includes(order)) {
    return res.status(400).send({ msg: "Invalid order request." });
  }

  if (!validColumns.includes(sort_by)) {
    return res.status(400).send({ msg: "Invalid sort_by column." });
  }

  fetchArticlesWithCommentCount()
    .then((articles) => {
      articles.sort((a, b) => {
        const aValue = a[sort_by];
        const bValue = b[sort_by];

        if (order.toLowerCase() === "asc") {
          return aValue < bValue ? -1 : 1;
        } else {
          return bValue < aValue ? -1 : 1;
        }
      });
      res.send(articles);
    })
    .catch(next);
};

module.exports = {
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
};
