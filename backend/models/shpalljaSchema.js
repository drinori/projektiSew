const mongoose = require("mongoose");

const shpalljaSchema = new mongoose.Schema({
  pozitaPunes: {
    type: String,
    required: true,
  },
  kategoriaPunes: {
    type: String,
    enum: ["administrate", "it"],
    required: true,
  },
  lokacioniPunes: {
    type: String,
    required: true,
  },
  pershkrimiPunes: {
    type: String,
    required: true,
  },
  pyetjet: {
    type: [String],
  },
  niveliPunes: {
    type: String,
    enum: [
      "",
      "praktike",
      "fillestar",
      "junior",
      "mid",
      "senior",
      "lider",
      "menaxher",
      "drejtor",
    ],
    required: false,
    default: "",
  },
  llojiPunesimit: {
    type: String,
    enum: ["", "fulltime", "parttime", "contract", "temporary", "internship"],
    required: false,
    default: "",
  },
  dataKrijimit: {
    type: Date,
    default: Date.now,
  },
});

const Shpallja = mongoose.model("Shpallja", shpalljaSchema, "shpalljet");
module.exports = Shpallja;
