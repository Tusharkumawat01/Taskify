import { getDB } from './initDB';
async function enableForeignKeys() {
  await db.execute('PRAGMA foreign_keys = ON');
}

enableForeignKeys();

// Generate a unique task ID (e.g., TASK-<timestamp>-<rand>)
function generateTaskId() {
  return `TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Use static user id = 100
const STATIC_USER_ID = 100;

export async function addTaskWithSubtasks({ title, description, due_date, priority, is_completed, subtasks }) {
  const db = await getDB();
  const taskId = generateTaskId();
  await db.run(
    `INSERT INTO tasks (id, user_id, title, description, due_date, priority, is_completed)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [taskId, STATIC_USER_ID, title, description, due_date, priority, is_completed === "Completed" ? 1 : 0]
  );
  if (subtasks && subtasks.length) {
    for (const st of subtasks) {
      if (!st.name) continue;
      await db.run(
        `INSERT INTO subtasks (task_id, title, description, due_date, priority, is_completed)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          taskId,
          st.name,
          st.description,
          st.dateTime,
          st.priority,
          st.status === "Completed" ? 1 : 0,
        ]
      );
    }
  }
}

//const STATIC_USER_ID = 100; // Adjust if different in your app

export async function fetchAllTasks() {
  const db = await getDB();
  const tasksResult = await db.query(
    `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
    [STATIC_USER_ID]
  );
  const tasks = tasksResult.values || [];
  const ret = [];
  for (const task of tasks) {
    const {
      id,
      user_id,
      title,
      description,
      is_completed,
      due_date,
      priority,
      created_at,
      updated_at
    } = task;
    const subtasksResult = await db.query(
      `SELECT * FROM subtasks WHERE task_id = ?`,
      [id]
    );
    const subtasks = (subtasksResult.values || []).map(st => ({
      id: st.id,
      name: st.title,
      description: st.description,
      dateTime: st.due_date,
      priority: st.priority,
      status: st.is_completed ? "Completed" : "Not Completed",
    }));
    ret.push({
      id,
      name: title,
      description,
      dateTime: due_date,
      priority,
      status: is_completed ? "Completed" : "Not Completed",
      subtasks,
    });
  }
  return ret;
}

export async function deleteTaskById(taskId) {
  const db = await getDB();
  await db.run(`DELETE FROM subtasks WHERE task_id = ?`, [taskId]);
  await db.run(`DELETE FROM tasks WHERE id = ?`, [taskId]);
}
// Export the task id generator if you want to use it elsewhere
export { generateTaskId };

