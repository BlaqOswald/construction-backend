import { pool } from "../../db";

// ======================
// CREATE SUPPLIER
// ======================
export const createSupplierService = async (data: any) => {
  try {
    const {
      project_id,
      name,
      location,
      contact,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO suppliers
      (
        project_id,
        name,
        location,
        contact
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        project_id,
        name,
        location || null,
        contact || null,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ CREATE SUPPLIER ERROR:", err);
    throw err;
  }
};

// ======================
// GET SUPPLIERS BY PROJECT
// ======================
export const getSuppliersByProjectService = async (
  projectId: string
) => {
  try {
    const suppliers = await pool.query(
      `
      SELECT *
      FROM suppliers
      WHERE project_id = $1
      ORDER BY created_at DESC
      `,
      [projectId]
    );

    const finalData = await Promise.all(
      suppliers.rows.map(async (supplier) => {
        // DELIVERIES
        const deliveries = await pool.query(
          `
          SELECT *
          FROM supplier_deliveries
          WHERE supplier_id = $1
          ORDER BY created_at DESC
          `,
          [supplier.id]
        );

        // PAYMENTS
        const payments = await pool.query(
          `
          SELECT *
          FROM supplier_payments
          WHERE supplier_id = $1
          ORDER BY created_at DESC
          `,
          [supplier.id]
        );

        // TOTAL SUPPLIED
        const totalSupplied = deliveries.rows.reduce(
          (sum, d) => sum + Number(d.total_cost || 0),
          0
        );

        // TOTAL PAID
        const totalPaid = payments.rows.reduce(
          (sum, p) => sum + Number(p.amount_paid || 0),
          0
        );

        return {
          ...supplier,
          deliveries: deliveries.rows,
          payments: payments.rows,

          summary: {
            totalSupplied,
            totalPaid,
            balance: totalSupplied - totalPaid,
          },
        };
      })
    );

    return finalData;
  } catch (err) {
    console.error("❌ FETCH SUPPLIERS ERROR:", err);
    throw err;
  }
};

// ======================
// ADD DELIVERY
// ======================
export const addDeliveryService = async (
  data: any
) => {
  try {
    const {
      supplier_id,
      item_name,
      quantity,
      unit_cost,
      invoice_number,
      payment_status,
      date_sent,
    } = data;

    const qty = Number(quantity) || 0;
    const unit = Number(unit_cost) || 0;

    const total_cost = qty * unit;

    const result = await pool.query(
      `
      INSERT INTO supplier_deliveries
      (
        supplier_id,
        item_name,
        quantity,
        unit_cost,
        total_cost,
        invoice_number,
        payment_status,
        date_sent
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        supplier_id,
        item_name,
        qty,
        unit,
        total_cost,
        invoice_number || null,
        payment_status || "Unpaid",
        date_sent || null,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ ADD DELIVERY ERROR:", err);
    throw err;
  }
};

// ======================
// ADD PAYMENT
// ======================
export const addPaymentService = async (
  data: any
) => {
  try {
    const {
      supplier_id,
      amount_paid,
      payment_date,
      note,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO supplier_payments
      (
        supplier_id,
        amount_paid,
        payment_date,
        note
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        supplier_id,
        Number(amount_paid) || 0,
        payment_date || null,
        note || null,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ ADD PAYMENT ERROR:", err);
    throw err;
  }
};

// ======================
// UPDATE SUPPLIER
// ======================
export const updateSupplierService = async (
  id: string,
  data: any
) => {
  try {
    const result = await pool.query(
      `
      UPDATE suppliers
      SET
        name = $1,
        location = $2,
        contact = $3
      WHERE id = $4
      RETURNING *
      `,
      [
        data.name,
        data.location || null,
        data.contact || null,
        id,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ UPDATE SUPPLIER ERROR:", err);
    throw err;
  }
};

// ======================
// DELETE SUPPLIER
// ======================
export const deleteSupplierService = async (
  id: string
) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM suppliers
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ DELETE SUPPLIER ERROR:", err);
    throw err;
  }
};