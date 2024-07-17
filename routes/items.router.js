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

const router = express.Router();

router.get("/", getAllItems);
router.get("/:item_id", getItemById);
router.get("/type/:type", getItemsByType);
router.get("/style/:style", getItemsByStyle);
router.get("/size/:size", getItemsBySize);
router.get("/color1/:color1", getItemsByColor1);
router.get("/color2/:color2", getItemsByColor2);

router.patch("/:item_id/review_score", patchReviewScore);
router.patch("/:item_id/quantity", patchQuantity);
router.patch("/:item_id/likes", patchLikes);
router.patch("/:item_id/in_basket", patchInBasket);

module.exports = router;
