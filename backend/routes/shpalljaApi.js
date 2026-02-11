const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");
const Aplikimi = require("../models/aplikimiSchema");
const dergoMesazhin = require("../emailservice");

router.get("/kompania", async (req, res) => {
  try {
    const now = new Date();
    const expiryTime = 2 * 60 * 1000;

    const expiredJobs = await Shpallja.find({
      status: "aktiv",
      dataKrijimit: { $lt: new Date(now - expiryTime) },
    });

    for (const shpallja of expiredJobs) {
      shpallja.status = "skaduar";
      await shpallja.save();
    }
    const shpalljet = await Shpallja.find()
      .sort({ dataKrijimit: -1 })
      .populate("numriAplikimeve");
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
    const shpallja = await Shpallja.findById(req.params.id)
      .populate({
        path: "aplikimet",
        options: { sort: { dataAplikimit: -1 } },
      })
      .populate("numriAplikimeve");

    if (!shpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja nuk u gjet",
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

router.get("/:id/aplikimi", async (req, res) => {
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
  const {
    emailKompanise,
    pozitaPunes,
    kategoriaPunes,
    lokacioniPunes,
    pershkrimiPunes,
    pyetjet,
    kualifikimet,
    niveliPunes,
    orari,
    eksperienca,
    pagaPrej,
    pagaDeri,
    perdoruesiId,
  } = req.body;

  if (pagaDeri < pagaPrej) {
    return res.status(400).json({
      success: false,
      error: "Rangu i pages gabim!",
    });
  }

  console.log(
    emailKompanise,
    pozitaPunes,
    kategoriaPunes,
    lokacioniPunes,
    pershkrimiPunes,
    pyetjet,
    kualifikimet,
    niveliPunes,
    orari,
    eksperienca,
    pagaPrej,
    pagaDeri,
    perdoruesiId,
  );

  const shpallja = new Shpallja({
    emailKompanise,
    pozitaPunes,
    kategoriaPunes,
    lokacioniPunes,
    pershkrimiPunes,
    pyetjet: pyetjet || [],
    kualifikimet: kualifikimet || [],
    niveliPunes,
    orari,
    eksperienca,
    pagaPrej,
    pagaDeri,
    perdoruesiId,
  });

  const shpalljaPunes = await shpallja.save();

  return res.status(200).json({
    success: true,
    message: "puna u shpall me sukses",
    data: shpalljaPunes,
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const shpallja = await Shpallja.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "U fshi me sukses",
      data: shpallja,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const shpalljaId = req.params.id;
    const shpallja = await Shpallja.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const aplikantet = await Aplikimi.find({
      shpalljaId: shpalljaId,
    });

    if (aplikantet.length > 0) {
      const emailPerdoruesit = aplikantet
        .map((a) => a.emailAplikantit)
        .filter((email) => email && email.trim() !== "")
        .map((email) => email.trim().replace(/['"]+/g, ""));

      console.log("Emails sent to:", emailPerdoruesit);

      if (emailPerdoruesit.length > 0) {
        await dergoMesazhin(
          emailPerdoruesit,
          "Shpallja ka nderruar",
          "Shpallja ka nderruar, rishikoni aplikimin!",
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "U modifikua me sukses",
      data: shpallja,
      aplikantetNjoftuar: aplikantet.length,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

module.exports = router;
