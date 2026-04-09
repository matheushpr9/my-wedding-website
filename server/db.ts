import Database from "better-sqlite3";
import bcryptjs from "bcryptjs";
import path from "path";

const db = new Database(path.join(import.meta.dirname, "data.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    alt TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    comparecera INTEGER DEFAULT 1,
    acompanhantes TEXT DEFAULT '',
    mensagem TEXT DEFAULT '',
    confirmacao_num INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed admin user if none exists
const adminExists = db.prepare("SELECT id FROM admin_users LIMIT 1").get();
if (!adminExists) {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "admin123";
  const hash = bcryptjs.hashSync(pass, 10);
  db.prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)").run(user, hash);
  console.log(`Admin user created — username: ${user}`);
}

export default db;
