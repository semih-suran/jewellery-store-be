const express = require("express");
const {
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
} = require("../controllers/items.controller");

const itemsRouter = express.Router();

itemsRouter.get("/", getAllItems);
itemsRouter.get("/:item_id", getItemById);
itemsRouter.get("/type/:type", getItemsByType);
itemsRouter.get("/style/:style", getItemsByStyle);
itemsRouter.get("/size/:size", getItemsBySize);
itemsRouter.get("/color1/:color1", getItemsByColor1);
itemsRouter.get("/color2/:color2", getItemsByColor2);

itemsRouter.patch("/:item_id/review_score", patchReviewScore);
itemsRouter.patch("/:item_id/quantity", patchQuantity);
itemsRouter.patch("/:item_id/likes", patchLikes);
itemsRouter.patch("/:item_id/in_basket", patchInBasket);

module.exports = itemsRouter;
