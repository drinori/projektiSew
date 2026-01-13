const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const regjistrimiApi = require("./routes/regjistrimiApi");
const kycjaApi = require("./routes/kycjaApi");
const shpalljaApi = require("./routes/shpalljaApi");
const kerkoApi = require("./routes/kerkoApi");
const ckycjaApi = require("./routes/ckyckjaApi");
const profiliApi = require("./routes/profiliApi");
const aplikimiApi = require("./routes/aplikimiApi");
const kompaniteApi = require("./routes/kompaniteApi");
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
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      path: "/",
    },
  }),
);

app.use("/api/shpallja", kerkoApi);
app.use("/api/shpallja", aplikimiApi);
app.use("/api/shpallja", shpalljaApi);
app.use("/api/regjistrimi", regjistrimiApi);
app.use("/api/kycja", kycjaApi);
app.use("/api/ckycja", ckycjaApi);
app.use("/api/profili", profiliApi);
app.use("/api/kompania", kompaniteApi);

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
