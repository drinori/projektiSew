const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");
const Aplikimi = require("../models/aplikimiSchema");
const dergoMesazhin = require("../emailservice");
const axios = require("axios");

async function fetchCompanyPhoto(emailKompanise, perdoruesiId) {
  try {
    if (perdoruesiId) {
      const photoUrl = `http://localhost:3000/api/profili/${perdoruesiId}/foto`;

      try {
        await axios.head(photoUrl);
        return photoUrl;
      } catch (err) {
        console.log(`No photo found for user ${perdoruesiId}`);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching company photo:", error.message);
    return null;
  }
}

router.get("/kompania", async (req, res) => {
  try {
    const now = new Date();
    // const tridhjeteDite = 2 * 60 * 1000;
    const tridhjeteDite = 30 * 24 * 60 * 60 * 1000;
    const expiredJobs = await Shpallja.find({
      status: "aktiv",
      dataKrijimit: { $lt: new Date(now - tridhjeteDite) },
    });

    for (const shpallja of expiredJobs) {
      shpallja.status = "skaduar";
      await shpallja.save();
    }

    const shpalljet = await Shpallja.aggregate([
      {
        $lookup: {
          from: "aplikimet",
          localField: "_id",
          foreignField: "shpalljaId",
          as: "apps",
        },
      },
      {
        $addFields: {
          numriNePritje: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Ne_Pritje"] },
              },
            },
          },
          numriPranuar: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Pranuar"] },
              },
            },
          },
          numriRefuzuar: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Refuzuar"] },
              },
            },
          },
        },
      },
      {
        $project: { apps: 0 }, // remove the raw applications array
      },
      { $sort: { dataKrijimit: -1 } },
    ]);

    // Add company profile photos to each job posting
    const shpalljetWithPhotos = await Promise.all(
      shpalljet.map(async (shpallja) => {
        // If job posting doesn't have a photo URL, fetch from company profile
        if (!shpallja.fotoProfili) {
          const photoUrl = await fetchCompanyPhoto(
            shpallja.emailKompanise,
            shpallja.perdoruesiId,
          );

          if (photoUrl) {
            shpallja.fotoProfili = photoUrl;
          }
        }

        return shpallja;
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
    const perdoruesiId = req.session.perdoruesiId;

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
      niveliPunes,
      orari,
      aftesitePrimare,
      aftesiteSekondare,
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
      niveliPunes,
      orari,
      eksperienca,
      aftesitePrimare,
      aftesiteSekondare,
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
      niveliPunes,
      orari,
      eksperienca,
      aftesitePrimare,
      aftesiteSekondare,
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
    const shpalljaId = req.params.id;

    const aplikantet = await Aplikimi.find({ shpalljaId: shpalljaId });

    if (aplikantet.length > 0) {
      const emailPerdoruesit = aplikantet
        .map((a) => a.emailAplikantit)
        .filter((email) => email && email.trim() !== "")
        .map((email) => email.trim().replace(/['"]+/g, ""));

      console.log("Emails sent to:", emailPerdoruesit);

      if (emailPerdoruesit.length > 0) {
        await dergoMesazhin(
          emailPerdoruesit,
          "Shpallja eshte fshire",
          `Shpallja me id: ${shpalljaId}, e kompanise:  eshte fshire nga punedhenesi`,
        );
      }
    }

    await Aplikimi.deleteMany({ shpalljaId: shpalljaId });

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
