import db from "#db/client";

// Get all users 

export async function getUsers() {
    const { rows: users } = await Client.query(`SELECT' * FROM users;`); 
    return users;
}


// Get user by ID 

export async function getUserById(id) {
  const result = await db.query(
    `SELECT * FROM users WHERE id = $1;`,
    [id]
  );
  return result.rows[0];
}


// Get user with their tasks 

export async function getUserWithTasks(id) {
  const result = await db.query(
    `SELECT u.*, t.id as task_id, t.title, t.done 
     FROM users u 
     LEFT JOIN tasks t ON u.id = t.user_id 
     WHERE u.id = $1 
     ORDER BY t.id;`,
    [id]
  );
  return result.rows;
}

// Add user 

export async function createUser(username, password) {
  const result = await db.query(
    `INSERT INTO users (username, user_password) VALUES ($1, $2) RETURNING *;`,
    [username, password]
  );
  return result.rows[0];
}


// Edit user 

export async function updateUser(id, username, password) {
  const result = await db.query(
    `UPDATE users SET username = $2, user_password = $3 WHERE id = $1 RETURNING *;`,
    [id, username, password]
  );
  return result.rows[0];
}


// Delete user 

export async function deleteUser(id) {
  const result = await db.query(
    `DELETE FROM users WHERE id = $1 RETURNING *;`,
    [id]
  );
  return result.rows[0];
}