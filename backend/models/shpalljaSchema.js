const mongoose = require("mongoose");

const shpalljaSchema = new mongoose.Schema({
  emailKompanise: {
    type: String,
    required: true,
  },
  pozitaPunes: {
    type: String,
    required: true,
  },
  kategoriaPunes: {
    type: String,
    enum: [
      "Administrate",
      "IT",
      "Dizajner",
      "Infermieri",
      "Edukim",
      "Shitje dhe Marketing",
    ],
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
      "Praktike",
      "Fillestar",
      "Junior",
      "Mid-level",
      "Senior",
      "Lider",
      "Menaxher",
      "Drejtor",
    ],
    required: false,
    default: "",
  },
  orari: {
    type: [String],
    enum: ["", "Fulltime", "Part-time"],
    required: false,
    default: [],
  },
  eksperienca: {
    type: String,
    required: false,
  },
  pagaPrej: {
    type: Number,
    required: true,
  },
  pagaDeri: {
    type: Number,
    required: true,
  },
  dataKrijimit: {
    type: Date,
    default: Date.now,
  },
});

shpalljaSchema.virtual("aplikimet", {
  ref: "Aplikimi",
  localField: "_id",
  foreignField: "shpalljaId",
});

shpalljaSchema.virtual("numriAplikimeve", {
  ref: "Aplikimi",
  localField: "_id",
  foreignField: "shpalljaId",
  count: true,
});

shpalljaSchema.set("toJSON", { virtuals: true });
shpalljaSchema.set("toObject", { virtuals: true });

const Shpallja = mongoose.model("Shpallja", shpalljaSchema, "shpalljet");
module.exports = Shpallja;
