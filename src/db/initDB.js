import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);

let db = null;

export async function getDB() {
  if (db) return db;

  db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
  await db.open();

  // Users table with static user
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      email TEXT,
      password TEXT
    );
  `);

  const userCheck = await db.query('SELECT id FROM Users WHERE id = 100');
  if (!userCheck.values || userCheck.values.length === 0) {
    await db.run(
      `INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)`,
      [100, 'staticuser', 'static@example.com', 'password']
    );
  }

  // ---- DROP tables if exist, then recreate (for dev only!) ----
  await db.execute(`
    DROP TABLE IF EXISTS subtasks;
    DROP TABLE IF EXISTS tasks;
  `);

  // ---- CREATE new tables with correct types ----
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER DEFAULT 0,
      due_date DATETIME,
      priority TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS subtasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATETIME,
      priority TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}