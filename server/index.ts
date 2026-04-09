import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import cookieParser from "cookie-parser";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const UPLOADS_DIR = path.join(import.meta.dirname, "uploads");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(UPLOADS_DIR));

// --- Multer config ---
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// --- Auth middleware ---
function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Não autorizado" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// ==================== PUBLIC ROUTES ====================

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as any;
  if (!user || !bcryptjs.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 86400000 });
  res.json({ ok: true });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("token").json({ ok: true });
});

app.get("/api/auth/check", auth, (_req, res) => res.json({ ok: true }));

// Public: list active gifts
app.get("/api/gifts", (_req, res) => {
  const gifts = db.prepare("SELECT id, name, price, image FROM gifts WHERE active = 1 ORDER BY id").all();
  res.json(gifts);
});

// Public: list photos
app.get("/api/photos", (_req, res) => {
  const photos = db.prepare("SELECT id, filename, alt FROM photos ORDER BY sort_order, id").all();
  res.json(photos);
});


// ==================== ADMIN ROUTES ====================

// Gifts CRUD
app.get("/api/admin/gifts", auth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM gifts ORDER BY id DESC").all());
});

app.post("/api/admin/gifts", auth, upload.single("image"), (req, res) => {
  const { name, price } = req.body;
  if (!name || !price || !req.file) return res.status(400).json({ error: "Campos obrigatórios: name, price, image" });
  const image = `/uploads/${req.file.filename}`;
  const result = db.prepare("INSERT INTO gifts (name, price, image) VALUES (?, ?, ?)").run(name, Number(price), image);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/admin/gifts/:id", auth, upload.single("image"), (req, res) => {
  const { name, price, active } = req.body;
  const gift = db.prepare("SELECT * FROM gifts WHERE id = ?").get(Number(req.params.id)) as any;
  if (!gift) return res.status(404).json({ error: "Presente não encontrado" });

  const image = req.file ? `/uploads/${req.file.filename}` : gift.image;
  db.prepare("UPDATE gifts SET name = ?, price = ?, image = ?, active = ? WHERE id = ?")
    .run(name || gift.name, Number(price ?? gift.price), image, Number(active ?? gift.active), gift.id);
  res.json({ ok: true });
});

app.delete("/api/admin/gifts/:id", auth, (req, res) => {
  const gift = db.prepare("SELECT image FROM gifts WHERE id = ?").get(Number(req.params.id)) as any;
  if (gift?.image) {
    const filePath = path.join(import.meta.dirname, gift.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.prepare("DELETE FROM gifts WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

// Photos CRUD
app.get("/api/admin/photos", auth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM photos ORDER BY sort_order, id").all());
});

app.post("/api/admin/photos", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Imagem obrigatória" });
  const filename = `/uploads/${req.file.filename}`;
  const alt = req.body.alt || "";
  const maxOrder = (db.prepare("SELECT MAX(sort_order) as m FROM photos").get() as any)?.m || 0;
  const result = db.prepare("INSERT INTO photos (filename, alt, sort_order) VALUES (?, ?, ?)").run(filename, alt, maxOrder + 1);
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/admin/photos/:id", auth, (req, res) => {
  const photo = db.prepare("SELECT filename FROM photos WHERE id = ?").get(Number(req.params.id)) as any;
  if (photo?.filename) {
    const filePath = path.join(import.meta.dirname, photo.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.prepare("DELETE FROM photos WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});


app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
