-- Users Table
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  email TEXT,
  password TEXT
);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS agent_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  log TEXT DEFAULT 'login successful',
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed INTEGER DEFAULT 0,
  due_date DATETIME,
  vector_embedding BLOB,
  priority TEXT NOT NULL,
  parent_task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Notifications Table
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

-- Completed Tasks Table
CREATE TABLE IF NOT EXISTS completed_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES Users(id),
  due_date DATETIME REFERENCES tasks(due_date),
  title TEXT,
  description TEXT,
  vector_embedding BLOB,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source_task_id INTEGER,
  parent_task_id INTEGER,
  created_at DATETIME REFERENCES tasks(created_at),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Vector Embeddings Table
CREATE VIRTUAL TABLE IF NOT EXISTS vector_embeddings USING vss0(
  id TEXT PRIMARY KEY,
  embedding(1536)
);