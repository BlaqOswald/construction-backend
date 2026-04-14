import { pool } from "../../db";

// ======================
// CREATE
// ======================
export const addMaterial = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO materials
    (project_id, name, unit_cost, quantity_used, total_cost, currency, description, date_received)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.project_id,
      data.name,
      data.unit_cost,
      data.quantity_used,
      data.total_cost,
      data.currency,
      data.description || null,
      data.date_received || null,
    ]
  );

  return result.rows[0];
};

// ======================
// READ BY PROJECT
// ======================
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM materials WHERE project_id = $1 ORDER BY id DESC`,
    [projectId]
  );

  return result.rows;
};

// ======================
// DELETE
// ======================
export const deleteMaterial = async (id: string) => {
  await pool.query("DELETE FROM materials WHERE id = $1", [id]);
};

// ======================
// UPDATE
// ======================
export const updateMaterial = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE materials SET
      name = $1,
      unit_cost = $2,
      quantity_used = $3,
      total_cost = $4,
      currency = $5,
      description = $6,
      date_received = $7
    WHERE id = $8
    RETURNING *`,
    [
      data.name,
      data.unit_cost,
      data.quantity_used,
      data.total_cost,
      data.currency,
      data.description || null,
      data.date_received || null,
      id,
    ]
  );

  return result.rows[0];
};