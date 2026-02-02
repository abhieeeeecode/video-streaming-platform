const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { User, Video } = require("./models");
const { verifyToken, allowRoles } = require("./middleware");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   ENSURE UPLOADS FOLDER EXISTS ✅
======================= */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* =======================
   MULTER CONFIG (FIXED)
======================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files allowed"), false);
    }
    cb(null, true);
  },
});

/* =======================
   MONGODB CONNECTION
======================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/videoApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* =======================
   BASIC TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =======================
   AUTH ROUTES
======================= */
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role,
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =======================
   VIDEO UPLOAD ROUTE (FIXED 🔥)
======================= */
app.post(
  "/api/upload",
  verifyToken,
  allowRoles("admin", "editor"),
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("FILE RECEIVED:", req.file);

      const video = await Video.create({
        title: req.body.title || req.file.originalname,
        filename: req.file.filename,
        uploadedBy: req.user.id,
      });

      res.json({
        message: "Video uploaded successfully",
        video,
      });

      // simulate video processing
      setTimeout(async () => {
        const newStatus = Math.random() > 0.5 ? "safe" : "flagged";

        await Video.findByIdAndUpdate(video._id, {
          status: newStatus,
        });

        console.log(`Video ${video._id} processed as ${newStatus}`);
      }, 5000);
    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
      res.status(500).json({ error: err.message || "Upload failed" });
    }
  }
);

/* =======================
   VIDEO LIST ROUTE
======================= */
app.get("/api/videos", verifyToken, async (req, res) => {
  try {
    let videos;

    if (req.user.role === "admin") {
      videos = await Video.find().populate("uploadedBy", "email role");
    } else if (req.user.role === "viewer") {
      videos = await Video.find({
        status: { $regex: /^safe$/i }   // 👈 CASE-INSENSITIVE
      });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.patch(
  "/api/videos/:id/status",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    const { status } = req.body;

    if (!["safe", "flagged"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await Video.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated" });
  }
);


/* =======================
   VIDEO STREAM ROUTE
======================= */
app.get("/api/stream/:filename", (req, res) => {
  const videoPath = path.join(uploadDir, req.params.filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath).pipe(res);
  }
});

/* =======================
   START SERVER
======================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
