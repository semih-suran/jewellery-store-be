const {
  addMyExhibition,
  fetchAllExhibitions,
  fetchExhibitionsByUser,
  fetchExhibitionById,
  updateExhibitionById,
  deleteExhibitionById,
} = require("../models/curator-exhibitions.model");

const postExhibition = async (req, res, next) => {
  try {
    const exhibition = req.body;
    const createdExhibition = await addMyExhibition(exhibition);
    res.status(201).json(createdExhibition);
  } catch (error) {
    next(error);
  }
};

const getAllExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await fetchAllExhibitions();
    res.status(200).json(exhibitions);
  } catch (error) {
    next(error);
  }
};

const getExhibitionsByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const exhibitions = await fetchExhibitionsByUser(user_id);
    res.status(200).json(exhibitions);
  } catch (error) {
    next(error);
  }
};

const getExhibitionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exhibition = await fetchExhibitionById(id);
    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition not found" });
    }
    res.status(200).json(exhibition);
  } catch (error) {
    next(error);
  }
};

const patchExhibitionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedExhibition = req.body;
    const updated = await updateExhibitionById(id, updatedExhibition);
    if (!updated) {
      return res.status(404).json({ msg: "Exhibition not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteExhibition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedExhibition = await deleteExhibitionById(id);
    if (!deletedExhibition) {
      return res.status(404).json({ msg: "Exhibition not found" });
    }
    res.status(200).json({ msg: "Exhibition deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postExhibition,
  getAllExhibitions,
  getExhibitionsByUser,
  getExhibitionById,
  patchExhibitionById,
  deleteExhibition,
};
