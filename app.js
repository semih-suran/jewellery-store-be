const express = require("express");
const cors = require("cors");
const app = express();
const errorHandlers = require("./error-handlers");
const controllers = require("./controllers");

app.use(express.json());
app.use(cors());

app.use(errorHandlers.psqlErrorHandler);
app.use(errorHandlers.customErrorHandler);
app.use(errorHandlers.serverErrorHandler);

// NC News Articles Routes
app.get("/api", controllers.getAllEndpoints);
app.get("/api/topics", controllers.getAllTopics);
app.get("/api/comments", controllers.getAllCommentsByLifo);
app.get("/api/articles", (req, res, next) => {
  if (req.query.topic) {
    return controllers.getArticlesByTopicQuery(req, res, next);
  } else if (Object.keys(req.query).length > 0) {
    return controllers.getAllArticlesBySortQuery(req, res, next);
  } else {
    return controllers.getAllArticlesByLifo(req, res, next);
  }
});

app.get("/api/articles/:article_id", controllers.getArticleById);
app.get(
  "/api/articles/:article_id/comments",
  controllers.getCommentsByArticleIdLifo
);
app.post(
  "/api/articles/:article_id/comments",
  controllers.postCommentToArticle
);
app.patch("/api/articles/:article_id", controllers.patchArticleVotes);
app.delete("/api/comments/:comment_id", controllers.deleteComment);
app.get("/api/users", controllers.getAllUsers);
app.patch("/api/users/:username/makeDefault", controllers.setUserAsDefault);

// Jewellery Shop Routes
app.get("/api/items", controllers.getAllItems);
app.get("/api/items/:item_id", controllers.getItemById);
app.get("/api/items/type/:type", controllers.getItemsByType);
app.get("/api/items/style/:style", controllers.getItemsByStyle);
app.get("/api/items/size/:size", controllers.getItemsBySize);
app.get("/api/items/color1/:color1", controllers.getItemsByColor1);
app.get("/api/items/color2/:color2", controllers.getItemsByColor2);
app.get("/api/search", controllers.searchItems);
app.get("/api/shoppingusers", controllers.getAllShoppingUsers);
app.get("/api/shoppingusers/:user_id", controllers.getShoppingUserById);

app.patch(
  "/api/shoppingusers/:user_id/address",
  controllers.patchShoppingUserAddress
);
app.patch(
  "/api/shoppingusers/:user_id/nickname",
  controllers.patchShoppingUserNickname
);
app.patch("/api/items/:item_id/review_score", controllers.patchReviewScore);
app.patch("/api/items/:item_id/quantity", controllers.patchQuantity);
app.patch("/api/items/:item_id/likes", controllers.patchLikes);
app.patch("/api/items/:item_id/in_basket", controllers.patchInBasket);

app.post("/api/shoppingusers", controllers.postShoppingUser);
app.post("/create-payment-intent", controllers.postPaymentIntent);

// Shopping Bag Routes
app.get("/api/shoppingbag/:user_id", controllers.getShoppingBagHandler);
app.post("/api/shoppingbag", controllers.addShoppingBagItemHandler);
app.delete(
  "/api/shoppingbag/:user_id/:item_id",
  controllers.removeShoppingBagItemHandler
);

// Favourites Routes
app.get("/api/shoppingfavourites/:user_id", controllers.getFavouritesHandler);
app.post("/api/shoppingfavourites", controllers.addFavouriteHandler);
app.delete(
  "/api/shoppingfavourites/:user_id/:item_id",
  controllers.removeFavouriteHandler
);

// Reviews Routes
app.get("/api/shoppingreviews/:item_id", controllers.getReviewsHandler);
app.post("/api/shoppingreviews", controllers.postReviewHandler);
app.delete("/api/shoppingreviews/:review_id", controllers.deleteReviewHandler);

// Register Route
app.post("/api/register", controllers.registerUser);

// Login Route
app.post("/api/login", controllers.loginUser);

// Google Login Route
app.post("/api/google-login", controllers.googleLogin);

module.exports = app;
