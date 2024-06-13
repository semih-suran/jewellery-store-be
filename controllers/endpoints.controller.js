const fs = require("fs");
const endpointsPath = "./endpoints.json";

const getAllEndpoints = (req, res, next) => {
  try {
    const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));
    res.json(endpoints);
  } catch (error) {
    next(error);
  }
};

module.exports = {getAllEndpoints};
