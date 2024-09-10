module.exports = [
  {
    artPieceId: "String", // Unique ID for the artwork (from API)
    title: "String",
    artist: "String",
    date: "String",
    imageUrl: "String",
    description: "String", // Can be fetched from the API or customized by the user
    source: "String", // "h" for Harvard, "c" for Chicago
    isCustomDescription: "Boolean", // Track whether the description has been modified by the user
  },
];
