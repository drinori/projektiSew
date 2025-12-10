const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

router.post("/perdoruesi", async (req, res) => {
  try {
    console.log(req.body);

    let savedPerdorues;
    const { tipiPerdoruesit, email, fjalekalimi, emri, mbiemri, kompania } =
      req.body;

    const user = await Perdorues.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: "Perdoruesi ekziston",
      });
    }

    if (tipiPerdoruesit === "aplikant") {
      if (!emri) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emrin",
        });
      }
      if (!mbiemri) {
        return res.status(400).json({
          error: "Nuk e keni shenuar mbiemrin",
        });
      }
      if (!email) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emailin",
        });
      }
      if (!fjalekalimi) {
        return res.status(400).json({
          error: "Nuk e keni shenuar fjalekalimin",
        });
      }

      const aplikant = new Perdorues({
        emri,
        mbiemri,
        email,
        fjalekalimi,
        tipiPerdoruesit,
      });

      savedPerdorues = await aplikant.save();
    } else if (tipiPerdoruesit === "punedhenes") {
      if (!kompania) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emrin e kompanise",
        });
      }
      if (!email) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emailin",
        });
      }
      if (!fjalekalimi) {
        return res.status(400).json({
          error: "Nuk e keni shenuar fjalekalimin",
        });
      }

      const punedhenes = new Perdorues({
        kompania,
        email,
        fjalekalimi,
        tipiPerdoruesit,
      });

      savedPerdorues = await punedhenes.save();
    } else {
      return res.status(400).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${
        tipiPerdoruesit === "aplikant" ? "Aplikanti" : "Punëdhënësi"
      } u regjistrua me sukses!`,
      user: savedPerdorues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
      error: error.message,
    });
  }
});

module.exports = router;
