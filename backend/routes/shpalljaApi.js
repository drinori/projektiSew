const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");

router.get("/kompania", async (req, res) => {
  try {
    const shpalljet = await Shpallja.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: shpalljet,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shpallja = await Shpallja.findById(req.params.id);

    if (!shpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      data: shpallja,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i serverit",
    });
  }
});

router.post("/kompania", async (req, res) => {
  const { pozitaPunes, kategoriaPunes, lokacioniPunes, pershkrimiPunes } =
    req.body;

  console.log(pozitaPunes, kategoriaPunes, lokacioniPunes, pershkrimiPunes);

  const shpallja = new Shpallja({
    pozitaPunes,
    kategoriaPunes,
    lokacioniPunes,
    pershkrimiPunes,
  });

  const shpalljaPunes = await shpallja.save();

  return res.status(200).json({
    success: true,
    message: "puna u shpall me sukses",
    data: shpalljaPunes,
  });
});

module.exports = router;
