const {
  fetchAllCommentsByLifo,
  fetchCommentsByArticleId,
  addCommentToArticle,
  deleteCommentByCommentId,
  checkIfCommentExists,
} = require("../models/comments.model");
const { checkIfArticleExists } = require("../models/articles.model");

const getAllCommentsByLifo = (req, res, next) => {
  fetchAllCommentsByLifo()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const getCommentsByArticleIdLifo = async (req, res, next) => {
  const articleId = req.params.article_id;

  try {
    const articleExists = await checkIfArticleExists(articleId);

    if (!articleExists) {
      throw { status: 404, msg: "Non-existent Article ID" };
    }

    const comments = await fetchCommentsByArticleId(articleId);

    res.send(comments);
  } catch (error) {
    next(error);
  }
};

const postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;

  checkIfArticleExists(articleId)
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ msg: "Non-existent Article ID" });
      }
      return addCommentToArticle(articleId, username, body);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((error) => {
      if (
        error.status === 400 &&
        error.msg === "(username) and (body) are required fields."
      ) {
        return res.status(400).send(error);
      }
      next(error);
    });
};

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  checkIfCommentExists(commentId)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Non-existent Comment ID" });
      }
      return deleteCommentByCommentId(commentId);
    })
    .then((result) => {
      res.status(204).send(result);
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = {
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
};
