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
        message: "perdoruesi nuk ekziston",
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

module.exports = router;
