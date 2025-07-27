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
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ───────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(helmet());

// ─── Cloudinary Config ─────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sellhear-buyhear",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ─── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});
app.use(limiter);

// ─── Nodemailer Config ─────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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

// ─── GET Routes ────────────────────────────────────────────
app.get("/punjus", async (_, res) => {
  try {
    const data = await Punju.find();
    res.json(data);
  } catch (err) {
    console.error("❌ Punju fetch failed:", err);
    res.status(500).json({ error: "Failed to load fighting rooster data" });
  }
});

app.get("/goat", async (_, res) => {
  try {
    const data = await Goat.find();
    res.json(data);
  } catch (err) {
    console.error("❌ Goat fetch failed:", err);
    res.status(500).json({ error: "Failed to load goat data" });
  }
});

app.get("/buffalo", async (_, res) => {
  try {
    const data = await Buffalo.find();
    res.json(data);
  } catch (err) {
    console.error("❌ Buffalo fetch failed:", err);
    res.status(500).json({ error: "Failed to load buffalo data" });
  }
});

// ─── GET BY ID ─────────────────────────────────────────────
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
  } catch (err) {
    console.error("❌ Fetch by ID failed:", err);
    res.status(500).json({ error: "Failed to fetch by ID" });
  }
});

// ─── POST Submission ───────────────────────────────────────
app.post("/submit/:type", upload.single("image"), async (req, res) => {
  const { type } = req.params;
  const image = req.file ? req.file.path : "";
  const public_id = req.file ? req.file.filename : null;
  const body = req.body;

  let item;
  try {
    if (type === "punju") {
      item = new Punju({ ...body, image });
    } else if (type === "goat") {
      item = new Goat({ ...body, image });
    } else if (type === "buffalo") {
      item = new Buffalo({ ...body, image });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    await item.save();
    res.status(201).json({ message: `${type} submitted successfully!`, item });
  } catch (error) {
    console.error(`❌ Error submitting ${type}:`, error);

    if (public_id) {
      try {
        await cloudinary.uploader.destroy(public_id);
        console.log(`🗑️ Cloudinary image deleted: ${public_id}`);
      } catch (cloudErr) {
        console.error("❌ Failed to delete Cloudinary image:", cloudErr);
      }
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ─── OTP Authentication ────────────────────────────────────
const otpDataPath = path.join(__dirname, "data", "users.json");

const readOtpData = () =>
  JSON.parse(fs.readFileSync(otpDataPath, "utf8") || "[]");
const writeOtpData = (data) =>
  fs.writeFileSync(otpDataPath, JSON.stringify(data, null, 2));

app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

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
  } catch (err) {
    console.error("❌ OTP sending failed:", err);
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

// ─── Serve Frontend (Production) ───────────────────────────
const frontendPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ─── Root Health Check ─────────────────────────────────────
app.get("/", (_, res) => {
  res.send("✅ Backend is running!");
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
