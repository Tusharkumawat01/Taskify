import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

// Helper for enabling foreign key support after DB open
async function enableForeignKeys(database) {
  await database.execute('PRAGMA foreign_keys = ON');
}

export async function getDB() {
  if (db) return db;

  db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
  await db.open();

  // Always enable foreign key support as the first statement after open
  await enableForeignKeys(db);

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

  // Drop dependent tables for a clean dev reset (order matters)
  await db.execute(`
    DROP TABLE IF EXISTS completed_tasks;
    DROP TABLE IF EXISTS subtasks;
    DROP TABLE IF EXISTS tasks;
  `);

  // Recreate tables with correct types and foreign key relationships
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
      task_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATETIME,
      priority TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      id INTEGER REFERENCES Users(id),
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      related_id INTEGER,
      read_status INTEGER DEFAULT 0,
      scheduled_for DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS completed_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);

  return db;
}











// import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

// const sqlite = new SQLiteConnection(CapacitorSQLite);
// async function enableForeignKeys() {
//   await db.execute('PRAGMA foreign_keys = ON');
// }

// enableForeignKeys();


// let db = null;

// export async function getDB() {
//   if (db) return db;

//   db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
//   await db.open();

//   // Users table with static user
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS Users (
//       id INTEGER PRIMARY KEY,
//       username TEXT,
//       email TEXT,
//       password TEXT
//     );
//   `);

//   const userCheck = await db.query('SELECT id FROM Users WHERE id = 100');
//   if (!userCheck.values || userCheck.values.length === 0) {
//     await db.run(
//       `INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)`,
//       [100, 'staticuser', 'static@example.com', 'password']
//     );
//   }

//   // ---- DROP tables if exist, then recreate (for dev only!) ----
//   await db.execute(`
//     DROP TABLE IF EXISTS subtasks;
//     DROP TABLE IF EXISTS tasks;
//   `);

//   // ---- CREATE new tables with correct types ----
//   await db.execute(`

//   CREATE TABLE IF NOT EXISTS tasks (
//     id TEXT PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     title TEXT NOT NULL,
//     description TEXT,
//     is_completed INTEGER DEFAULT 0,
//     due_date DATETIME,
//     priority TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//   );

//   CREATE TABLE IF NOT EXISTS subtasks (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     task_id TEXT NOT NULL,
//     title TEXT NOT NULL,
//     description TEXT,
//     due_date DATETIME,
//     priority TEXT NOT NULL,
//     is_completed INTEGER DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
//   );

//   CREATE TABLE IF NOT EXISTS completed_tasks (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   task_id TEXT NOT NULL,
//   completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
// );
// `);
//   return db;
// }
