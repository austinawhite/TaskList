import db from "#db/client";

// Get all tasks 

export async function getAllTasks() {
  const query = `
    SELECT t.*, u.username 
    FROM tasks t 
    JOIN users u ON t.user_id = u.id 
    ORDER BY t.id;
  `;
  const result = await db.query(query);
  return result.rows;
}


// Get task by ID 

export async function getTaskById(id) {
  const query = `SELECT * FROM tasks WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}


// Get all tasks with users attached 

export async function getTasksByUserId(userId) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE user_id = $1 ORDER BY id;`,
    [userId]
  );
  return result.rows;
}


// Add task 

export async function createTask(title, done, userId) {
  const result = await db.query(
    `INSERT INTO tasks (title, done, user_id) VALUES ($1, $2, $3) RETURNING *;`,
    [title, done, userId]
  );
  return result.rows[0];
}


// Edit task 

export async function updateTask(id, title, done) {
  const result = await db.query(
    `UPDATE tasks SET title = $2, done = $3 WHERE id = $1 RETURNING *;`,
    [id, title, done]
  );
  return result.rows[0];
}


// Delete Task 

export async function deleteTask(id) {
  const result = await db.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING *;`,
    [id]
  );
  return result.rows[0];
}