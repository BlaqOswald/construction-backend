import { pool } from "../../db";

const safeNumber = (v: any) => {
  if (v === null || v === undefined || v === "") return 0;
  return Number(v);
};

export const addMaterial = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO materials (
      project_id,
      name,
      unit_cost,
      quantity_used,
      total_cost,
      currency,
      description,
      date_received
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.project_id,
      data.name || "Unnamed",
      safeNumber(data.unit_cost),
      safeNumber(data.quantity_used),
      safeNumber(data.total_cost),
      data.currency || "UGX",
      data.description || "",
      data.date_received || null,
    ]
  );

  return result.rows[0];
};

export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM materials WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};

export const deleteMaterial = async (id: string) => {
  await pool.query(`DELETE FROM materials WHERE id = $1`, [id]);
};

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
      data.name || "Unnamed",
      safeNumber(data.unit_cost),
      safeNumber(data.quantity_used),
      safeNumber(data.total_cost),
      data.currency || "UGX",
      data.description || "",
      data.date_received || null,
      id,
    ]
  );

  return result.rows[0];
};