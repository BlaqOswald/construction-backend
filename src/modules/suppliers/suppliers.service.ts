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

              // ADVANCES
              const advances =
                await pool.query(
                  `
            SELECT *
            FROM supplier_advances
            WHERE supplier_id = $1
            ORDER BY deposit_date ASC, created_at ASC
            `,
                  [supplier.id]
                );

              // TOTAL SUPPLIED
              const totalSupplied =
                deliveries.rows.reduce(
                  (sum, d) =>
                    sum + Number(d.total_cost || 0),
                  0
                );

              // TOTAL PAID (from payments table — includes advance-sourced payments)
              const totalPaid =
                payments.rows.reduce(
                  (sum, p) =>
                    sum + Number(p.amount_paid || 0),
                  0
                );

              // ADVANCE SUMMARY
              const totalAdvanced =
                advances.rows.reduce(
                  (sum, a) =>
                    sum + Number(a.amount || 0),
                  0
                );

              const advanceRemaining =
                advances.rows.reduce(
                  (sum, a) =>
                    sum + Number(a.remaining_balance || 0),
                  0
                );

              const advanceConsumed =
                totalAdvanced - advanceRemaining;

              return {
                ...supplier,

                deliveries:
                  deliveries.rows,

                payments:
                  payments.rows,

                advances:
                  advances.rows,

                summary: {
                  totalSupplied,
                  totalPaid,
                  balance: totalSupplied - totalPaid,

                  // advance breakdown
                  totalAdvanced,
                  advanceConsumed,
                  advanceRemaining,
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
// ADD ADVANCE (DEPOSIT BEFORE PURCHASE)
// Records the upfront payment and stores full amount as remaining_balance.
// ======================
export const addAdvanceService =
  async (data: any) => {
    try {
      const {
        supplier_id,
        amount,
        deposit_date,
        note,
      } = data;

      const amt = Number(amount) || 0;

      const result =
        await pool.query(
          `
      INSERT INTO supplier_advances
      (
        supplier_id,
        amount,
        deposit_date,
        note,
        remaining_balance
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
          [
            supplier_id,
            amt,
            deposit_date || null,
            note || null,
            amt, // initially the full amount is unallocated
          ]
        );

      return result.rows[0];
    } catch (err) {
      console.error(
        "❌ ADD ADVANCE ERROR:",
        err
      );

      throw err;
    }
  };

// ======================
// INTERNAL HELPER: consume advance balance against a delivery
// Called automatically inside addDeliveryService.
// Works FIFO across all advances with remaining_balance > 0.
// ======================
const consumeAdvancesForDelivery = async (
  supplier_id: string,
  delivery_id: string,
  delivery_total: number,
  delivery_date: string | null
) => {
  // Fetch advances that still have balance, oldest deposit first
  const advances = await pool.query(
    `
    SELECT *
    FROM supplier_advances
    WHERE supplier_id = $1
      AND remaining_balance > 0
    ORDER BY deposit_date ASC, created_at ASC
    `,
    [supplier_id]
  );

  let remainingCost = delivery_total;

  for (const advance of advances.rows) {
    if (remainingCost <= 0) break;

    const availableFromAdvance =
      Number(advance.remaining_balance);

    const consumeNow =
      remainingCost >= availableFromAdvance
        ? availableFromAdvance
        : remainingCost;

    // Insert payment record linked to this advance
    await pool.query(
      `
      INSERT INTO supplier_payments
      (
        supplier_id,
        delivery_id,
        amount_paid,
        payment_date,
        note,
        source_advance_id
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        supplier_id,
        delivery_id,
        consumeNow,
        delivery_date || advance.deposit_date,
        `Auto-allocated from advance deposited on ${advance.deposit_date ?? "N/A"}`,
        advance.id,
      ]
    );

    // Reduce the advance's remaining balance
    await pool.query(
      `
      UPDATE supplier_advances
      SET remaining_balance = remaining_balance - $1
      WHERE id = $2
      `,
      [consumeNow, advance.id]
    );

    remainingCost -= consumeNow;
  }

  // Whatever was covered by advances
  const coveredByAdvance = delivery_total - remainingCost;

  // Determine payment status for this delivery
  let paymentStatus = "Unpaid";
  if (coveredByAdvance >= delivery_total) {
    paymentStatus = "Paid";
  } else if (coveredByAdvance > 0) {
    paymentStatus = "Partial";
  }

  return paymentStatus;
};

// ======================
// ADD DELIVERY
// After inserting, auto-consumes available advance balance (FIFO).
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
        date_sent,
      } = data;

      const qty = Number(quantity) || 0;
      const unit = Number(unit_cost) || 0;
      const total_cost = qty * unit;

      // Insert delivery first (status will be updated after advance check)
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
            invoice_number || null,
            "Unpaid", // default; will update below
            date_sent || null,
          ]
        );

      const delivery = result.rows[0];

      // Auto-consume any available advance balance
      const resolvedStatus =
        await consumeAdvancesForDelivery(
          supplier_id,
          delivery.id,
          total_cost,
          date_sent || null
        );

      // Update payment status based on advance coverage
      if (resolvedStatus !== "Unpaid") {
        await pool.query(
          `
          UPDATE supplier_deliveries
          SET payment_status = $1
          WHERE id = $2
          `,
          [resolvedStatus, delivery.id]
        );

        delivery.payment_status = resolvedStatus;
      }

      return delivery;
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
            Number(amount_paid) || 0,
            payment_date || null,
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
            data.location || null,
            data.contact || null,
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
        `DELETE FROM supplier_payments WHERE supplier_id = $1`,
        [id]
      );

      await pool.query(
        `DELETE FROM supplier_deliveries WHERE supplier_id = $1`,
        [id]
      );

      await pool.query(
        `DELETE FROM supplier_advances WHERE supplier_id = $1`,
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
      const quantity = Number(data.quantity);
      const unit_cost = Number(data.unit_cost);
      const total_cost = quantity * unit_cost;

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
// Restores advance balance for any advance-sourced payments on this delivery.
// ======================
export const deleteDeliveryService =
  async (id: string) => {
    try {
      // Find any payments sourced from an advance so we can restore balance
      const advancePayments = await pool.query(
        `
        SELECT *
        FROM supplier_payments
        WHERE delivery_id = $1
          AND source_advance_id IS NOT NULL
        `,
        [id]
      );

      // Restore each advance's remaining_balance
      for (const p of advancePayments.rows) {
        await pool.query(
          `
          UPDATE supplier_advances
          SET remaining_balance = remaining_balance + $1
          WHERE id = $2
          `,
          [Number(p.amount_paid), p.source_advance_id]
        );
      }

      await pool.query(
        `DELETE FROM supplier_payments WHERE delivery_id = $1`,
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
          `SELECT * FROM supplier_deliveries WHERE id = $1`,
          [delivery_id]
        );

      const row = delivery.rows[0];

      if (!row) {
        throw new Error("Delivery not found");
      }

      const existingPayments =
        await pool.query(
          `
        SELECT COALESCE(SUM(amount_paid), 0) as total
        FROM supplier_payments
        WHERE delivery_id = $1
        `,
          [delivery_id]
        );

      const alreadyPaid =
        Number(existingPayments.rows[0].total);

      const totalCost = Number(row.total_cost);
      const newPaid = alreadyPaid + Number(amount_paid);

      let status = "Partial";
      if (newPaid >= totalCost) {
        status = "Paid";
      }

      await pool.query(
        `
      INSERT INTO supplier_payments
      (supplier_id, delivery_id, amount_paid, payment_date)
      VALUES ($1,$2,$3,$4)
      `,
        [supplier_id, delivery_id, amount_paid, payment_date]
      );

      await pool.query(
        `UPDATE supplier_deliveries SET payment_status = $1 WHERE id = $2`,
        [status, delivery_id]
      );

      return { success: true };
    } catch (err) {
      console.error("❌ PAY DELIVERY ERROR:", err);
      throw err;
    }
  };

// ======================
// BULK PAYMENT ENGINE
// Pays against existing unpaid/partial deliveries (FIFO).
// ======================
export const bulkPaymentService = async (data: any) => {
  const {
    supplier_id,
    amount_paid,
    payment_date,
    note,
  } = data;

  let remaining = Number(amount_paid);

  // 1. GET UNPAID + PARTIAL DELIVERIES (FIFO)
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
      SELECT COALESCE(SUM(amount_paid), 0) as paid
      FROM supplier_payments
      WHERE delivery_id = $1
      `,
      [d.id]
    );

    const alreadyPaid = Number(paidResult.rows[0].paid);
    const balance = Number(d.total_cost) - alreadyPaid;

    if (balance <= 0) continue;

    const payNow =
      remaining >= balance ? balance : remaining;

    // 3. INSERT PAYMENT
    await pool.query(
      `
      INSERT INTO supplier_payments
      (supplier_id, delivery_id, amount_paid, payment_date, note)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [supplier_id, d.id, payNow, payment_date, note || null]
    );

    remaining -= payNow;

    // 4. UPDATE STATUS
    const newBalance = balance - payNow;
    const status = newBalance === 0 ? "Paid" : "Partial";

    await pool.query(
      `UPDATE supplier_deliveries SET payment_status = $1 WHERE id = $2`,
      [status, d.id]
    );
  }

  return {
    success: true,
    remaining_unallocated: remaining,
  };
};