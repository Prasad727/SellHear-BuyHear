const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());

// ✅ Serve uploaded images with proper CORS headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// ─── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});
app.use(limiter);

// ─── DB Connections ─────────────────────────────────────────
const uriBase = process.env.MONGO_URI_BASE;
if (!uriBase) {
  console.error("❌ MONGO_URI_BASE not defined in .env");
  process.exit(1);
}

const punjuConnection = mongoose.createConnection(`${uriBase}my-hen-db`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const goatConnection = mongoose.createConnection(`${uriBase}my-goat-db`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const buffaloConnection = mongoose.createConnection(`${uriBase}my-buffalo-db`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

punjuConnection.once("open", () => console.log("✅ Connected to punjus DB"));
goatConnection.once("open", () => console.log("✅ Connected to goats DB"));
buffaloConnection.once("open", () => console.log("✅ Connected to buffaloes DB"));

// ─── Schemas & Models ──────────────────────────────────────
const punjuSchema = require("./models/Punju");
const goatSchema = require("./models/Goat");
const buffaloSchema = require("./models/Buffalo");

const Punju = punjuConnection.model("Punju", punjuSchema);
const Goat = goatConnection.model("Goat", goatSchema);
const Buffalo = buffaloConnection.model("Buffalo", buffaloSchema);

// ─── Multer Setup ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ─── GET Routes ────────────────────────────────────────────
app.get("/punjus", async (_, res) => {
  try {
    const data = await Punju.find();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to load fighting rooster data" });
  }
});

app.get("/goat", async (_, res) => {
  try {
    const data = await Goat.find();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to load goat data" });
  }
});

app.get("/buffalo", async (_, res) => {
  try {
    const data = await Buffalo.find();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to load buffalo data" });
  }
});

app.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    let Model;
    if (type === "punju") Model = Punju;
    else if (type === "goat") Model = Goat;
    else if (type === "buffalo") Model = Buffalo;
    else return res.status(400).json({ error: "Invalid type" });

    const item = await Model.findById(id);
    if (!item) return res.status(404).json({ error: "Not found" });

    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to fetch by ID" });
  }
});

// ─── POST Submission Route ────────────────────────────────
app.post("/submit/:type", upload.single("image"), async (req, res) => {
  const { type } = req.params;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const body = req.body;

  try {
    let item;
    if (type === "punju") {
      item = new Punju({
        name: body.name,
        price: body.price,
        description: body.description,
        seller: body.seller,
        sellerphone_no: body.sellerphone_no,
        location: body.location,
        image,
      });
    } else if (type === "goat") {
      item = new Goat({
        name: body.name,
        price: body.price,
        weight: body.weight,
        description: body.description,
        seller: body.seller,
        sellerphone_no: body.sellerphone_no,
        location: body.location,
        image,
      });
    } else if (type === "buffalo") {
      item = new Buffalo({
        name: body.name,
        price: body.price,
        description: body.description,
        milk_capacity: body.milk_capacity,
        seller: body.seller,
        sellerphone_no: body.sellerphone_no,
        location: body.location,
        image,
      });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    await item.save();
    res.status(201).json({ message: `${type} submitted successfully!`, item });
  } catch (error) {
    console.error(`Error submitting ${type}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ─── OTP Authentication ───────────────────────────────────
const otpDataPath = path.join(__dirname, "data", "users.json");

const readOtpData = () =>
  JSON.parse(fs.readFileSync(otpDataPath, "utf8") || "[]");
const writeOtpData = (data) =>
  fs.writeFileSync(otpDataPath, JSON.stringify(data, null, 2));

app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    const users = readOtpData();
    const updatedUsers = users.filter((u) => u.email !== email);
    updatedUsers.push({ email, otp });
    writeOtpData(updatedUsers);

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

app.post("/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const users = readOtpData();
  const user = users.find(
    (u) => u.email === email && u.otp === parseInt(otp)
  );

  if (user) {
    writeOtpData(users.filter((u) => u.email !== email));
    res.json({ success: true, email });
  } else {
    res.status(400).json({ success: false });
  }
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
