const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const regjistrimiApi = require("./routes/regjistrimiApi");
const kycjaApi = require("./routes/kycjaApi");
const shpalljaApi = require("./routes/shpalljaApi");
const perdoruesiApi = require("./routes/perdoruesiApi");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
  }),
);

app.use("/api/regjistrimi", regjistrimiApi);
app.use("/api/kycja", kycjaApi);
app.use("/api/shpallja", shpalljaApi);
app.use("/api/perdoruesi", perdoruesiApi);
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(process.env.PORT, () =>
  console.log("server running", process.env.PORT),
);
