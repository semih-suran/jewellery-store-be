const {
  fetchReviews,
  addReview,
  deleteReview,
} = require("../models/shoppingreviews.model");

const getReviewsHandler = async (req, res, next) => {
  const { item_id } = req.params;
  try {
    const reviews = await fetchReviews(item_id);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

const postReviewHandler = async (req, res, next) => {
  const { user_id, item_id, rating, review } = req.body;
  try {
    const newReview = await addReview(user_id, item_id, rating, review);
    res.status(201).send({ review: newReview });
  } catch (err) {
    next(err);
  }
};

const deleteReviewHandler = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    await deleteReview(review_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReviewsHandler,
  postReviewHandler,
  deleteReviewHandler,
};
