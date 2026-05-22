import { pool } from "../../db";



// =============================
// CREATE CATEGORY
// =============================

export const addCategory = async (data: any) => {
  try {
    const {
      project_id,
      name,
      status,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO predev_categories
      (
        project_id,
        name,
        status
      )

      VALUES ($1, $2, $3)

      RETURNING *
      `,
      [
        project_id,
        name,
        status || "Not Started",
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ CATEGORY INSERT ERROR:", err);
    throw err;
  }
};



// =============================
// GET CATEGORIES BY PROJECT
// =============================

export const getCategoriesByProject = async (
  projectId: string
) => {
  try {
    const result = await pool.query(
      `
      SELECT
        c.*,

        COALESCE(
          SUM(i.amount_paid),
          0
        ) AS total_spent,

        COUNT(i.id) AS transactions

      FROM predev_categories c

      LEFT JOIN predev_cost_items i
      ON i.category_id = c.id

      WHERE c.project_id = $1

      GROUP BY c.id

      ORDER BY c.created_at DESC
      `,
      [projectId]
    );

    return result.rows;
  } catch (err) {
    console.error("❌ CATEGORY FETCH ERROR:", err);
    throw err;
  }
};



// =============================
// UPDATE CATEGORY
// =============================

export const updateCategory = async (
  id: string,
  data: any
) => {
  try {
    const result = await pool.query(
      `
      UPDATE predev_categories

      SET
        name = $1,
        status = $2

      WHERE id = $3

      RETURNING *
      `,
      [
        data.name,
        data.status,
        id,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ CATEGORY UPDATE ERROR:", err);
    throw err;
  }
};



// =============================
// DELETE CATEGORY
// =============================

export const deleteCategory = async (
  id: string
) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM predev_categories
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ CATEGORY DELETE ERROR:", err);
    throw err;
  }
};



// =============================
// CREATE COST ITEM
// =============================

export const addCostItem = async (
  data: any
) => {
  try {
    const {
      category_id,
      item_name,
      description,
      amount_paid,
      date_paid,
      paid_to,
      invoice_number,
      status,
      notes,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO predev_cost_items
      (
        category_id,
        item_name,
        description,
        amount_paid,
        date_paid,
        paid_to,
        invoice_number,
        status,
        notes
      )

      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )

      RETURNING *
      `,
      [
        category_id,
        item_name,
        description || null,
        Number(amount_paid) || 0,
        date_paid || null,
        paid_to || null,
        invoice_number || null,
        status || "Paid",
        notes || null,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ COST ITEM INSERT ERROR:", err);
    throw err;
  }
};



// =============================
// GET ITEMS BY CATEGORY
// =============================

export const getItemsByCategory = async (
  categoryId: string
) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM predev_cost_items

      WHERE category_id = $1

      ORDER BY created_at DESC
      `,
      [categoryId]
    );

    return result.rows;
  } catch (err) {
    console.error("❌ ITEM FETCH ERROR:", err);
    throw err;
  }
};



// =============================
// UPDATE COST ITEM
// =============================

export const updateCostItem = async (
  id: string,
  data: any
) => {
  try {
    const result = await pool.query(
      `
      UPDATE predev_cost_items

      SET
        item_name = $1,
        description = $2,
        amount_paid = $3,
        date_paid = $4,
        paid_to = $5,
        invoice_number = $6,
        status = $7,
        notes = $8

      WHERE id = $9

      RETURNING *
      `,
      [
        data.item_name,
        data.description || null,
        Number(data.amount_paid) || 0,
        data.date_paid || null,
        data.paid_to || null,
        data.invoice_number || null,
        data.status,
        data.notes || null,
        id,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ COST ITEM UPDATE ERROR:", err);
    throw err;
  }
};



// =============================
// DELETE COST ITEM
// =============================

export const deleteCostItem = async (
  id: string
) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM predev_cost_items
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ COST ITEM DELETE ERROR:", err);
    throw err;
  }
};



// =============================
// ADD ATTACHMENT
// =============================

export const addAttachment = async (
  data: any
) => {
  try {
    const {
      cost_item_id,
      file_url,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO predev_attachments
      (
        cost_item_id,
        file_url
      )

      VALUES ($1, $2)

      RETURNING *
      `,
      [
        cost_item_id,
        file_url,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ ATTACHMENT INSERT ERROR:", err);
    throw err;
  }
};



// =============================
// GET ATTACHMENTS
// =============================

export const getAttachments = async (
  costItemId: string
) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM predev_attachments

      WHERE cost_item_id = $1

      ORDER BY uploaded_at DESC
      `,
      [costItemId]
    );

    return result.rows;
  } catch (err) {
    console.error("❌ ATTACHMENT FETCH ERROR:", err);
    throw err;
  }
};



// =============================
// DELETE ATTACHMENT
// =============================

export const deleteAttachment = async (
  id: string
) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM predev_attachments
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ ATTACHMENT DELETE ERROR:", err);
    throw err;
  }
};