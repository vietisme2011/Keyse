import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./key.json";

app.use(cors());
app.use(express.json());

// Lấy danh sách key
app.get("/keys", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");
    const data = fs.readFileSync(DATA_FILE", "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Thêm key
app.post("/keys", (req, res) => {
  try {
    const body = req.body;
    if (!body.key) return res.status(400).json({ error: "Missing key" });

    const existing = fs.existsSync(DATA_FILE)
      ? JSON.parse(fs.readFileSync(DATA_FILE))
      : {};

    existing[body.key] = body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

    res.json({ ok: true, message: "Key added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Xóa key
app.delete("/keys/:key", (req, res) => {
  try {
    const k = req.params.key;
    if (!fs.existsSync(DATA_FILE)) return res.json({ ok: false });
    const existing = JSON.parse(fs.readFileSync(DATA_FILE));
    delete existing[k];
    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
    res.json({ ok: true, message: "Key deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Trang test
app.get("/", (req, res) => {
  res.send("✅ Key Server is running with CORS enabled");
});

app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
