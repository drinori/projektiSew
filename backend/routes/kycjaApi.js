const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

router.post("/perdoruesi", async (req, res) => {
  try {
    const { email, fjalekalimi } = req.body;
    console.log(req.body);

    let userResponse;

    const user = await Perdorues.findOne({ email, fjalekalimi });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        error: "perdoruesi nuk ekziston",
      });
    }

    if (user.tipiPerdoruesit === "aplikant") {
      userResponse = {
        _id: user._id,
        emri: user.emri,
        mbiemri: user.mbiemri,
        email: user.email,
        tipiPerdoruesit: user.tipiPerdoruesit,
      };
    } else if (user.tipiPerdoruesit === "punedhenes") {
      userResponse = {
        _id: user._id,
        kompania: user.kompania,
        email: user.email,
        tipiPerdoruesit: user.tipiPerdoruesit,
      };
    }

    req.session.userId = user._id;

    res.json({
      success: true,
      userResponse,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/perdoruesi", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        error: "Nuk jeni kycur",
      });
    }

    const user = await Perdorues.findById(req.session.userId);

    return res.status(200).json({
      success: true,
      userResponse: {
        _id: user._id,
        emri: user.emri,
        mbiemri: user.mbiemri,
        email: user.email,
        kompania: user.kompania,
        tipiPerdoruesit: user.tipiPerdoruesit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem i serverit",
    });
  }
});

module.exports = router;
