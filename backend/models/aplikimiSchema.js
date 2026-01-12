const mongoose = require("mongoose");

const aplikimiSchema = new mongoose.Schema({
  shpalljaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shpallja",
    required: true,
  },
  emailAplikantit: {
    type: String,
    required: true,
  },
  emriAplikantit: {
    type: String,
    required: true,
  },
  mbiemriAplikantit: {
    type: String,
    required: true,
  },
  eksperienca: {
    type: String,
    required: false,
  },
  niveliPunes: {
    type: String,
    required: false,
  },
  letraMotivuese: {
    type: String,
    required: true,
  },
});

const Aplikimi = mongoose.model("Aplikimi", aplikimiSchema, "aplikimet");
module.exports = Aplikimi;
