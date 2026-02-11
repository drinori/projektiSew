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
      "industria",
      "administrate",
      "agrikulture-industri-ushqimore",
      "arkitekture",
      "banka",
      "retail-distribuim",
      "ndertimtari-patundshmeri",
      "mbeshtetje-konsumatoreve-call-center",
      "ekonomi-finance-kontabilitet",
      "edukim-shkence-hulumtim",
      "pune-te-pergjithshme",
      "burime-njerezore",
      "teknologji-informacioni",
      "sigurim",
      "gazetari-shtyp-media",
      "ligj-legjislacion",
      "menaxhment",
      "marketing-reklamim-pr",
      "inxhinieri",
      "shendetesi-medicine",
      "Prodhim",
      "Siguri$Mbrojtje",
      "Industri te sherbimit",
      "Telekomunikim",
      "Tekstil, Lekure, Industri Veshembathje",
      "Gastronomi, Hoteleri, Turizem",
      "Transport, Logjistike",
      "IT",
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
  kualifikimet: {
    type: [String],
    default: [],
    required: false,
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
    enum: ["", "Full-time", "Part-time"],
    required: true,
    default: [],
  },
  eksperienca: {
    type: String,
    required: false,
  },
  pagaPrej: {
    type: Number,
    required: false,
  },
  pagaDeri: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ["aktiv", "skaduar"],
    default: "aktiv",
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
