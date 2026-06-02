// suppliers.service.ts

import { pool } from "../../db";

// ======================
// CREATE SUPPLIER
// ======================
export const createSupplierService =
  async (data: any) => {
    try {
      const {
        project_id,
        name,
        location,
        contact,
      } = data;

      const result =
        await pool.query(
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
      console.error(
        "❌ CREATE SUPPLIER ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// GET SUPPLIERS BY PROJECT
// ======================
export const getSuppliersByProjectService =
  async (
    projectId: string
  ) => {
    try {
      const suppliers =
        await pool.query(
          `
      SELECT *
      FROM suppliers
      WHERE project_id = $1
      ORDER BY created_at DESC
      `,
          [projectId]
        );

      const finalData =
        await Promise.all(
          suppliers.rows.map(
            async (supplier) => {

              // DELIVERIES
              const deliveries =
                await pool.query(
                  `
            SELECT *
            FROM supplier_deliveries
            WHERE supplier_id = $1
            ORDER BY created_at DESC
            `,
                  [supplier.id]
                );

              // PAYMENTS
              const payments =
                await pool.query(
                  `
            SELECT *
            FROM supplier_payments
            WHERE supplier_id = $1
            ORDER BY created_at DESC
            `,
                  [supplier.id]
                );

              // TOTAL SUPPLIED
              const totalSupplied =
                deliveries.rows.reduce(
                  (
                    sum,
                    d
                  ) =>
                    sum +
                    Number(
                      d.total_cost ||
                        0
                    ),
                  0
                );

              // TOTAL PAID
              const totalPaid =
                payments.rows.reduce(
                  (
                    sum,
                    p
                  ) =>
                    sum +
                    Number(
                      p.amount_paid ||
                        0
                    ),
                  0
                );

              return {
                ...supplier,

                deliveries:
                  deliveries.rows,

                payments:
                  payments.rows,

                summary: {
                  totalSupplied,
                  totalPaid,

                  balance:
                    totalSupplied -
                    totalPaid,
                },
              };
            }
          )
        );

      return finalData;
    } catch (err) {
      console.error(
        "❌ FETCH SUPPLIERS ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// ADD DELIVERY
// ======================
export const addDeliveryService =
  async (data: any) => {
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

      const qty =
        Number(quantity) || 0;

      const unit =
        Number(unit_cost) || 0;

      const total_cost =
        qty * unit;

      const result =
        await pool.query(
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
            invoice_number ||
              null,
            payment_status ||
              "Unpaid",
            date_sent || null,
          ]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ ADD DELIVERY ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// ADD PAYMENT
// ======================
export const addPaymentService =
  async (data: any) => {
    try {
      const {
        supplier_id,
        amount_paid,
        payment_date,
        note,
      } = data;

      const result =
        await pool.query(
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
            Number(
              amount_paid
            ) || 0,
            payment_date ||
              null,
            note || null,
          ]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ ADD PAYMENT ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// UPDATE SUPPLIER
// ======================
export const updateSupplierService =
  async (
    id: string,
    data: any
  ) => {
    try {
      const result =
        await pool.query(
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
            data.location ||
              null,
            data.contact ||
              null,
            id,
          ]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ UPDATE SUPPLIER ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// DELETE SUPPLIER
// ======================
export const deleteSupplierService =
  async (id: string) => {
    try {

      await pool.query(
        `
        DELETE FROM supplier_payments
        WHERE supplier_id = $1
        `,
        [id]
      );

      await pool.query(
        `
        DELETE FROM supplier_deliveries
        WHERE supplier_id = $1
        `,
        [id]
      );

      const result =
        await pool.query(
          `
      DELETE FROM suppliers
      WHERE id = $1
      RETURNING *
      `,
          [id]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ DELETE SUPPLIER ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// UPDATE DELIVERY
// ======================
export const updateDeliveryService =
  async (
    id: string,
    data: any
  ) => {
    try {
      const quantity = Number(
        data.quantity
      );

      const unit_cost = Number(
        data.unit_cost
      );

      const total_cost =
        quantity *
        unit_cost;

      const result =
        await pool.query(
          `
      UPDATE supplier_deliveries
      SET
        item_name = $1,
        quantity = $2,
        unit_cost = $3,
        total_cost = $4,
        invoice_number = $5,
        payment_status = $6,
        date_sent = $7
      WHERE id = $8
      RETURNING *
      `,
          [
            data.item_name,
            quantity,
            unit_cost,
            total_cost,
            data.invoice_number,
            data.payment_status,
            data.date_sent,
            id,
          ]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ UPDATE DELIVERY ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// DELETE DELIVERY
// ======================
export const deleteDeliveryService =
  async (id: string) => {
    try {

      await pool.query(
        `
        DELETE FROM supplier_payments
        WHERE delivery_id = $1
        `,
        [id]
      );

      const result =
        await pool.query(
          `
      DELETE FROM supplier_deliveries
      WHERE id = $1
      RETURNING *
      `,
          [id]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ DELETE DELIVERY ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// PAY DELIVERY
// ======================
export const payDeliveryService =
  async (data: any) => {
    try {
      const {
        delivery_id,
        supplier_id,
        amount_paid,
        payment_date,
      } = data;

      const delivery =
        await pool.query(
          `
      SELECT *
      FROM supplier_deliveries
      WHERE id = $1
      `,
          [delivery_id]
        );

      const row =
        delivery.rows[0];

      if (!row) {
        throw new Error(
          "Delivery not found"
        );
      }

      const existingPayments =
        await pool.query(
          `
        SELECT COALESCE(
          SUM(amount_paid),
          0
        ) as total
        FROM supplier_payments
        WHERE delivery_id = $1
        `,
          [delivery_id]
        );

      const alreadyPaid =
        Number(
          existingPayments
            .rows[0].total
        );

      const totalCost =
        Number(
          row.total_cost
        );

      const newPaid =
        alreadyPaid +
        Number(amount_paid);

      let status =
        "Partial";

      if (
        newPaid >= totalCost
      ) {
        status = "Paid";
      }

      await pool.query(
        `
      INSERT INTO supplier_payments
      (
        supplier_id,
        delivery_id,
        amount_paid,
        payment_date
      )
      VALUES ($1,$2,$3,$4)
      `,
        [
          supplier_id,
          delivery_id,
          amount_paid,
          payment_date,
        ]
      );

      await pool.query(
        `
      UPDATE supplier_deliveries
      SET payment_status = $1
      WHERE id = $2
      `,
        [
          status,
          delivery_id,
        ]
      );

      return {
        success: true,
      };
    } catch (err) {
      console.error(
        "❌ PAY DELIVERY ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// BULK ENGINE 
// ======================
  export const bulkPaymentService = async (data: any) => {
  const {
    supplier_id,
    amount_paid,
    payment_date,
    note,
  } = data;

  let remaining = Number(amount_paid);

  // 1. GET UNPAID + PARTIAL ITEMS (FIFO)
  const deliveries = await pool.query(
    `
    SELECT *
    FROM supplier_deliveries
    WHERE supplier_id = $1
    AND payment_status != 'Paid'
    ORDER BY created_at ASC
    `,
    [supplier_id]
  );

  for (const d of deliveries.rows) {
    if (remaining <= 0) break;

    // 2. GET already paid for this delivery
    const paidResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount_paid),0) as paid
      FROM supplier_payments
      WHERE delivery_id = $1
      `,
      [d.id]
    );

    const alreadyPaid = Number(paidResult.rows[0].paid);
    const balance = Number(d.total_cost) - alreadyPaid;

    if (balance <= 0) continue;

    let payNow = 0;

    if (remaining >= balance) {
      payNow = balance;
    } else {
      payNow = remaining;
    }

    // 3. INSERT PAYMENT FOR THIS ITEM
    await pool.query(
      `
      INSERT INTO supplier_payments
      (supplier_id, delivery_id, amount_paid, payment_date, note)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        supplier_id,
        d.id,
        payNow,
        payment_date,
        note || null,
      ]
    );

    remaining -= payNow;

    // 4. UPDATE STATUS
    const newBalance = balance - payNow;

    let status = "Partial";
    if (newBalance === 0) status = "Paid";

    await pool.query(
      `
      UPDATE supplier_deliveries
      SET payment_status = $1
      WHERE id = $2
      `,
      [status, d.id]
    );
  }

  return {
    success: true,
    remaining_unallocated: remaining,
  };
};