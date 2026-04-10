import { pool } from "../../db";

/**
 * CREATE TASK
 */
export const addTask = async (data: any) => {
  const total_cost =
    data.unit_cost * data.workers_count * data.duration;

  const result = await pool.query(
    `INSERT INTO tasks
    (project_id, activity, description, workers_count, unit_cost, duration, total_cost, status, start_date, end_date)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      data.project_id,
      data.activity,
      data.description,
      data.workers_count,
      data.unit_cost,
      data.duration,
      total_cost,
      data.status,
      data.start_date,
      data.end_date,
    ]
  );

  return result.rows[0];
};

/**
 * GET TASKS BY PROJECT
 */
export const getTasksByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};

/**
 * GET TASK BY ID
 */
export const getTaskById = async (taskId: string) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE id = $1`,
    [taskId]
  );

  return result.rows[0];
};