import { pool } from "../../db";

// ======================
// CREATE / UPSERT MATERIAL
// Unique on (project_id, name) — prevents duplicates in reports
// ======================
export const addMaterial = async (data: any) => {
  try {
    const {
      project_id,
      name,
      unit_cost,
      quantity_used,
      currency,
      description,
      date_received,
      category,
      supplier_id,
      supplied_by,
    } = data;

    const result = await pool.query(
      `INSERT INTO materials
        (project_id, name, unit_cost, quantity_used, total_cost,
         currency, description, date_received, category, supplier_id, supplied_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (project_id, name)
       DO UPDATE SET
         unit_cost     = EXCLUDED.unit_cost,
         quantity_used = EXCLUDED.quantity_used,
         total_cost    = EXCLUDED.total_cost,
         currency      = EXCLUDED.currency,
         description   = COALESCE(EXCLUDED.description, materials.description),
         date_received = EXCLUDED.date_received,
         category      = EXCLUDED.category,
         supplier_id   = EXCLUDED.supplier_id,
         supplied_by   = EXCLUDED.supplied_by
       RETURNING *`,
      [
        project_id,
        name,
        Number(unit_cost) || 0,
        Number(quantity_used) || 0,
        Number(unit_cost) * Number(quantity_used),
        currency,
        description || null,
        date_received || null,
        category || null,
        supplied_by === "supplier" ? (supplier_id || null) : null,
        supplied_by || "random",
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
// Joins supplier name so the frontend doesn't need a second request
// ======================
export const getByProject = async (user: any, projectId: string) => {
  try {
    if (user?.role === "admin") {
      const result = await pool.query(
        `SELECT m.*, s.name AS supplier_name
         FROM materials m
         LEFT JOIN suppliers s ON s.id = m.supplier_id
         ORDER BY m.created_at DESC`
      );
      return result.rows;
    }

    const result = await pool.query(
      `SELECT m.*, s.name AS supplier_name
       FROM materials m
       LEFT JOIN suppliers s ON s.id = m.supplier_id
       WHERE m.project_id = ANY($1)
       ORDER BY m.created_at DESC`,
      [user.projectIds]
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
         name          = $1,
         unit_cost     = $2,
         quantity_used = $3,
         total_cost    = $4,
         currency      = $5,
         description   = $6,
         date_received = $7,
         category      = $8,
         supplier_id   = $9,
         supplied_by   = $10
       WHERE id = $11
       RETURNING *`,
      [
        data.name,
        Number(data.unit_cost) || 0,
        Number(data.quantity_used) || 0,
        Number(data.unit_cost) * Number(data.quantity_used),
        data.currency,
        data.description || null,
        data.date_received || null,
        data.category || null,
        data.supplied_by === "supplier" ? (data.supplier_id || null) : null,
        data.supplied_by || "random",
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
