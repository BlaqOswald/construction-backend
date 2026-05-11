import { pool } from "../../db";

// CREATE
export const createTask = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO tasks
    (project_id, activity, description, workers_count, unit_cost, quantity, total_cost, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.project_id,
      data.activity,
      data.description,
      data.workers_count,
      data.unit_cost,
      data.quantity,
      data.total_cost,
      data.status,
    ]
  );

  return result.rows[0];
};

// GET BY PROJECT
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};

// UPDATE
export const updateTask = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE tasks SET
      activity=$1,
      description=$2,
      workers_count=$3,
      unit_cost=$4,
      quantity=$5,
      total_cost=$6,
      status=$7
     WHERE id=$8
     RETURNING *`,
    [
      data.activity,
      data.description,
      data.workers_count,
      data.unit_cost,
      data.quantity,
      data.total_cost,
      data.status,
      id,
    ]
  );

  return result.rows[0];
};

// DELETE
export const deleteTask = async (id: string) => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
};