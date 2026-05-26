import { pool } from "../../db";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO tasks (
      project_id,
      activity,
      description,
      workers_count,
      unit_cost,
      quantity,
      total_cost,
      status,
      start_date,
      end_date,
      task_type,
      category,
      subcontractor_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    [
      data.project_id,
      data.activity,
      data.description || null,
      data.workers_count || 0,
      data.unit_cost || 0,
      data.quantity || 0,
      data.total_cost || 0,
      data.status || "pending",
      data.start_date || null,
      data.end_date || null,
      data.task_type || "in_house",
      data.category || null,
      data.subcontractor_id || null,
    ]
  );

  return result.rows[0];
};

/* =========================
   GET BY PROJECT
========================= */
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};

/* =========================
   UPDATE TASK (ONLY FIELDS IN FORM)
========================= */
export const updateTask = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE tasks SET
      activity = $1,
      description = $2,
      workers_count = $3,
      unit_cost = $4,
      quantity = $5,
      total_cost = $6,
      status = $7,
      start_date = $8,
      end_date = $9,
      task_type = $10,
      category = $11,
      subcontractor_id = $12
     WHERE id = $13
     RETURNING *`,
    [
      data.activity,
      data.description || null,
      data.workers_count || 0,
      data.unit_cost || 0,
      data.quantity || 0,
      data.total_cost || 0,
      data.status || "pending",
      data.start_date || null,
      data.end_date || null,
      data.task_type || "in_house",
      data.category || null,
      data.subcontractor_id || null,
      id,
    ]
  );

  return result.rows[0];
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (id: string) => {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
};

/* =========================
   TASK LOGS (DAILY ENTRIES)
========================= */

// ADD LOG
export const addTaskLog = async (data: any) => {
  const total_cost =
    Number(data.quantity_done || 0) *
    Number(data.unit_cost || 0);

  const result = await pool.query(
    `INSERT INTO task_logs (
      task_id,
      entry_date,
      quantity_done,
      workers_count,
      worker_type,
      unit_cost,
      total_cost,
      progress_percent,
      remarks
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      data.task_id,
      data.entry_date,
      data.quantity_done,
      data.workers_count,
      data.worker_type,
      data.unit_cost,
      total_cost,
      data.progress_percent,
      data.remarks,
    ]
  );

  return result.rows[0];
};

// GET LOGS
export const getTaskLogs = async (projectId: string) => {
  const result = await pool.query(
    `
    SELECT
      tl.*,
      t.activity AS task_name,
      t.category,
      t.task_type
    FROM task_logs tl
    JOIN tasks t
      ON t.id = tl.task_id
    WHERE t.project_id = $1
    ORDER BY tl.entry_date DESC
    `,
    [projectId]
  );

  return result.rows;
};