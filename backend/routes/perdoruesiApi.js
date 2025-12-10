const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

router.get("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(400).json({
        success: false,
        error: "Nuk jeni kycur",
      });
    }

    const user = await Perdorues.findById(req.session.userId);

    return res.status(200).json({
      success: true,
      user: {
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
