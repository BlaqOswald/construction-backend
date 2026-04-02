import { pool } from "../db";

// CREATE TASK
export const createTask = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO task (name, project_id, assigned_to)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.project_id, data.assigned_to || null]
  );

  return result.rows[0];
};

// GET ALL TASKS
export const getTasks = async () => {
  const result = await pool.query(`
    SELECT task.*, project.name AS project_name
    FROM task
    JOIN project ON task.project_id = project.id
  `);

  return result.rows;
};

// GET TASKS BY PROJECT
export const getTasksByProject = async (project_id: string) => {
  const result = await pool.query(
    `SELECT * FROM task WHERE project_id = $1`,
    [project_id]
  );

  return result.rows;
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (id: string, status: string) => {
  const result = await pool.query(
    `UPDATE task SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};
