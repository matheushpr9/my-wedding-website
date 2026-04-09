import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DB_PATH = path.join(ROOT, "server", "data.db");
const PUBLIC = path.join(ROOT, "public");
const UPLOADS_SRC = path.join(ROOT, "server", "uploads");

if (!fs.existsSync(DB_PATH)) {
  console.error("❌ Banco não encontrado em", DB_PATH);
  console.error("   Rode 'npm run server' e cadastre os dados pelo /admin primeiro.");
  process.exit(1);
}

// Limpa e recria pastas
for (const dir of ["data", "uploads"]) {
  const p = path.join(PUBLIC, dir);
  fs.rmSync(p, { recursive: true, force: true });
  fs.mkdirSync(p, { recursive: true });
}

const db = new Database(DB_PATH, { readonly: true });

// Exporta presentes ativos
const gifts = db.prepare("SELECT id, name, price, image FROM gifts WHERE active = 1 ORDER BY id").all();
fs.writeFileSync(path.join(PUBLIC, "data", "gifts.json"), JSON.stringify(gifts, null, 2));

// Exporta fotos
const photos = db.prepare("SELECT id, filename, alt FROM photos ORDER BY sort_order, id").all();
fs.writeFileSync(path.join(PUBLIC, "data", "photos.json"), JSON.stringify(photos, null, 2));

// Copia imagens
const images = db.prepare("SELECT image AS p FROM gifts WHERE active = 1 UNION SELECT filename AS p FROM photos").all() as { p: string }[];
for (const { p: img } of images) {
  const filename = path.basename(img);
  const src = path.join(UPLOADS_SRC, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(PUBLIC, "uploads", filename));
  } else {
    console.warn("⚠️  Imagem não encontrada:", src);
  }
}

db.close();

console.log("✅ Export concluído!");
console.log(`   📦 ${gifts.length} presentes → public/data/gifts.json`);
console.log(`   📷 ${photos.length} fotos    → public/data/photos.json`);
console.log(`   🖼️  Imagens copiadas     → public/uploads/`);
console.log("");
console.log("   Agora rode: npm run build");
