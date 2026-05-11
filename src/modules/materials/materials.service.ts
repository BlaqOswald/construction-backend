import { pool } from "../../db";

// ======================
// CREATE MATERIAL (SAFE)
// ======================
export const addMaterial = async (data: any) => {
  try {
    const {
      project_id,
      name,
      unit_cost,
      quantity_used,
      total_cost,
      currency,
      description,
      date_received,
    } = data;

    const result = await pool.query(
      `INSERT INTO materials
      (project_id, name, unit_cost, quantity_used, total_cost, currency, description, date_received)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        project_id,
        name,
        Number(unit_cost) || 0,
        Number(quantity_used) || 0,
        Number(total_cost) || 0,
        currency,
        description || null,
        date_received || null,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ MATERIAL INSERT ERROR:", err);
    throw err;
  }
};

// ======================
// GET BY PROJECT
// ======================
export const getByProject = async (projectId: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM materials WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId]
    );

    return result.rows;
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    throw err;
  }
};

// ======================
// UPDATE
// ======================
export const updateMaterial = async (id: string, data: any) => {
  try {
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
        Number(data.unit_cost) || 0,
        Number(data.quantity_used) || 0,
        Number(data.total_cost) || 0,
        data.currency,
        data.description || null,
        data.date_received || null,
        id,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    throw err;
  }
};

// ======================
// DELETE
// ======================
export const deleteMaterial = async (id: string) => {
  try {
    const result = await pool.query(
      `DELETE FROM materials WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    throw err;
  }
};