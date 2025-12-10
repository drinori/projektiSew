const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

router.get("/", async (req, res) => {
  const user = await Perdorues.findById(req.userId);

  res.render("");
});
