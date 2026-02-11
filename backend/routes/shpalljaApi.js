const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");
const Aplikimi = require("../models/aplikimiSchema");
const dergoMesazhin = require("../emailservice");
const axios = require("axios");

// Helper function to fetch company profile photo
async function fetchCompanyPhoto(emailKompanise, perdoruesiId) {
  try {
    // Method 1: If you have perdoruesiId directly
    if (perdoruesiId) {
      const photoUrl = `http://localhost:3000/api/profili/${perdoruesiId}/foto`;

      // Check if photo exists by making a HEAD request
      try {
        await axios.head(photoUrl);
        return photoUrl;
      } catch (err) {
        console.log(`No photo found for user ${perdoruesiId}`);
        return null;
      }
    }

    // Method 2: If you need to look up user by email first
    // Uncomment this if you need to find user ID by email:
    /*
    const Perdoruesi = require("../models/perdoruesiSchema");
    const user = await Perdoruesi.findOne({ email: emailKompanise });
    if (user && user._id) {
      const photoUrl = `http://localhost:3000/api/profili/${user._id}/foto`;
      try {
        await axios.head(photoUrl);
        return photoUrl;
      } catch (err) {
        console.log(`No photo found for user ${user._id}`);
        return null;
      }
    }
    */

    return null;
  } catch (error) {
    console.error("Error fetching company photo:", error.message);
    return null;
  }
}

router.get("/kompania", async (req, res) => {
  try {
    const now = new Date();
    // const expiryTime = 2 * 60 * 1000;
    const expiryTime = 30 * 24 * 60 * 60 * 1000;

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

    // Add company profile photos to each job posting
    const shpalljetWithPhotos = await Promise.all(
      shpalljet.map(async (shpallja) => {
        const shpalljaObj = shpallja.toObject();

        // If job posting doesn't have a photo URL, fetch from company profile
        if (!shpalljaObj.fotoProfili) {
          const photoUrl = await fetchCompanyPhoto(
            shpallja.emailKompanise,
            shpallja.perdoruesiId,
          );

          if (photoUrl) {
            shpalljaObj.fotoProfili = photoUrl;
          }
        }

        return shpalljaObj;
      }),
    );

    return res.status(200).json({
      success: true,
      data: shpalljetWithPhotos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});

router.get("/kompania/im", async (req, res) => {
  try {
    const perdoruesiId = req.userId;

    const shpalljet = await Shpallja.find({ perdoruesiId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: shpalljet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shpallja = await Shpallja.findById(req.params.id)
      .populate({
        path: "aplikimet",
        options: { sort: { dataAplikimit: -1 } },
      })
      .populate("numriAplikimeve")
      .populate("perdoruesiId");

    if (!shpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja nuk u gjet",
      });
    }

    const shpalljaObj = shpallja.toObject();

    // If no photo in job posting, get from company profile
    if (!shpalljaObj.fotoProfili) {
      const photoUrl = await fetchCompanyPhoto(
        shpallja.emailKompanise,
        shpallja.perdoruesiId,
      );

      if (photoUrl) {
        shpalljaObj.fotoProfili = photoUrl;
      }
    }

    return res.status(200).json({
      success: true,
      data: shpalljaObj,
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
  try {
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

    // Automatically fetch company profile photo URL
    const fotoProfili = await fetchCompanyPhoto(emailKompanise, perdoruesiId);

    if (fotoProfili) {
      console.log("Company photo URL attached:", fotoProfili);
    } else {
      console.log("No company photo found");
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
      fotoProfili ? "Photo URL attached" : "No photo",
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
      fotoProfili, // Store the photo URL
    });

    const shpalljaPunes = await shpallja.save();

    return res.status(200).json({
      success: true,
      message: "puna u shpall me sukses",
      data: shpalljaPunes,
    });
  } catch (err) {
    console.error("Error creating shpallja:", err);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
      error: err.message,
    });
  }
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

    const updateData = { ...req.body };

    // Refresh the company photo URL if not provided in update
    if (!updateData.fotoProfili) {
      const shpallja = await Shpallja.findById(shpalljaId);
      if (shpallja) {
        const photoUrl = await fetchCompanyPhoto(
          shpallja.emailKompanise,
          shpallja.perdoruesiId,
        );

        if (photoUrl) {
          updateData.fotoProfili = photoUrl;
        }
      }
    }

    const shpallja = await Shpallja.findByIdAndUpdate(shpalljaId, updateData, {
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
