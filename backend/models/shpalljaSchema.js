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
});

const Shpallja = mongoose.model("Shpallja", shpalljaSchema, "shpalljet");
module.exports = Shpallja;
