import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

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

// Copia e otimiza imagens
const MAX_SIZE = 200 * 1024; // 200KB
const MAX_WIDTH = 1200;

const images = db.prepare("SELECT image AS p FROM gifts WHERE active = 1 UNION SELECT filename AS p FROM photos").all() as { p: string }[];
let optimized = 0;

for (const { p: img } of images) {
  const filename = path.basename(img);
  const src = path.join(UPLOADS_SRC, filename);
  const dest = path.join(PUBLIC, "uploads", filename);

  if (!fs.existsSync(src)) {
    console.warn("⚠️  Imagem não encontrada:", src);
    continue;
  }

  const stat = fs.statSync(src);
  if (stat.size > MAX_SIZE) {
    const ext = path.extname(filename).toLowerCase();
    let pipeline = sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true });
    if (ext === ".png") pipeline = pipeline.png({ quality: 80 });
    else pipeline = pipeline.jpeg({ quality: 80 });
    await pipeline.toFile(dest);
    const newSize = fs.statSync(dest).size;
    console.log(`   🗜️  ${filename}: ${(stat.size / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB`);
    optimized++;
  } else {
    fs.copyFileSync(src, dest);
  }
}

db.close();

console.log("✅ Export concluído!");
console.log(`   📦 ${gifts.length} presentes → public/data/gifts.json`);
console.log(`   📷 ${photos.length} fotos    → public/data/photos.json`);
console.log(`   🖼️  Imagens copiadas     → public/uploads/ (${optimized} otimizadas)`);
console.log("");
console.log("   Agora rode: npm run build");
