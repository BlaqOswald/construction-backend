import { pool } from "../../db";

export const addTask = async (data: any) => {
  const total_cost =
    Number(data.unit_cost) *
    Number(data.quantity || data.workers_count || 1);

  const result = await pool.query(
    `INSERT INTO tasks
    (project_id, activity, description, workers_count, unit_cost, quantity, total_cost, status, start_date, end_date)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      data.project_id,
      data.activity,
      data.description || null,
      data.workers_count,
      data.unit_cost,
      data.quantity,
      total_cost,
      data.status,
      data.start_date || null,
      data.end_date || null,
    ]
 );

  return result.rows[0];
};

export const getTasksByProject = async (projectId: string) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC",
    [projectId]
  );

  return result.rows;
};

export const getTaskById = async (taskId: string) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [taskId]
  );

  return result.rows[0];
};
