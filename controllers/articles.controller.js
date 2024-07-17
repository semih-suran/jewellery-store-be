const {
  fetchArticleById,
  fetchArticlesWithCommentCount,
  patchVotes,
  fetchArticlesByTopic,
  checkIfArticleExists,
} = require("../models/articles.model");

const getArticleById = async (req, res, next) => {
  const articleId = req.params.article_id;

  try {
    const article = await fetchArticleById(articleId);
    if (article.length === 0) {
      throw { status: 404, msg: "Article Not Found" };
    }
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};

const getAllArticlesByLifo = async (req, res, next) => {
  try {
    const articles = await fetchArticlesWithCommentCount();
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

const patchArticleVotes = async (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes, ...moreKeys } = req.body;

  try {
    const articleExists = await checkIfArticleExists(articleId);
    if (!articleExists) {
      return res.status(404).send({ msg: "Non-existent Article ID" });
    }
    if (inc_votes === undefined && Object.keys(moreKeys).length > 0) {
      return res
        .status(400)
        .send({ msg: "(inc_votes) is required and should be the only key." });
    }
    const article = await patchVotes(articleId, inc_votes);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};

const getArticlesByTopicQuery = async (req, res, next) => {
  const query = req.query.topic;

  try {
    if (!query) {
      return getAllArticlesByLifo(req, res, next);
    }
    const topics = await fetchArticlesByTopic(query);
    res.status(200).send(topics);
  } catch (err) {
    next(err);
  }
};

const getAllArticlesBySortQuery = async (req, res, next) => {
  const { sort_by = "created_at", order = "desc" } = req.query;
  const validColumns = [
    "created_at",
    "author",
    "title",
    "votes",
    "comment_count",
    "topic",
    "article_id",
  ];
  const validOrders = ["asc", "desc"];

  if (!validOrders.includes(order)) {
    return res.status(400).send({ msg: "Invalid order request." });
  }

  if (!validColumns.includes(sort_by)) {
    return res.status(400).send({ msg: "Invalid sort_by column." });
  }

  try {
    const articles = await fetchArticlesWithCommentCount();
    articles.sort((a, b) => {
      const aValue = a[sort_by];
      const bValue = b[sort_by];

      if (order.toLowerCase() === "asc") {
        return aValue < bValue ? -1 : 1;
      } else {
        return bValue < aValue ? -1 : 1;
      }
    });
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllArticlesBySortQuery,
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
};
