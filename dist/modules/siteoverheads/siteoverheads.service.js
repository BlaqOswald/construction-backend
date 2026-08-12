"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = exports.deleteSiteOverhead = exports.updateSiteOverhead = exports.getByProject = exports.addSiteOverhead = void 0;
const db_1 = require("../../db");
// ======================
// CREATE OVERHEAD
// ======================
const addSiteOverhead = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id, category, item_name, description, frequency, monthly_amount, start_date, end_date, ongoing, next_due_date, responsible_person, payment_terms, notes, } = data;
        const result = yield db_1.pool.query(`
      INSERT INTO site_overheads (
        project_id,
        category,
        item_name,
        description,
        frequency,
        monthly_amount,
        start_date,
        end_date,
        ongoing,
        next_due_date,
        responsible_person,
        payment_terms,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `, [
            project_id,
            category,
            item_name,
            description || null,
            frequency,
            Number(monthly_amount) || 0,
            start_date || null,
            end_date || null,
            ongoing !== null && ongoing !== void 0 ? ongoing : true,
            next_due_date || null,
            responsible_person || null,
            payment_terms || null,
            notes || null,
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ OVERHEAD CREATE ERROR:", err);
        throw err;
    }
});
exports.addSiteOverhead = addSiteOverhead;
// ======================
// GET BY PROJECT
// ======================
const getByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      SELECT 
        so.*,

        COALESCE(
          json_agg(oph.*)
          FILTER (WHERE oph.id IS NOT NULL),
          '[]'
        ) AS payment_history

      FROM site_overheads so

      LEFT JOIN overhead_payment_history oph
      ON so.id = oph.overhead_id

      WHERE so.project_id = $1

      GROUP BY so.id

      ORDER BY so.created_at DESC
      `, [projectId]);
        return result.rows;
    }
    catch (err) {
        console.error("❌ FETCH ERROR:", err);
        throw err;
    }
});
exports.getByProject = getByProject;
// ======================
// UPDATE
// ======================
const updateSiteOverhead = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield db_1.pool.query(`
      UPDATE site_overheads SET
        category = $1,
        item_name = $2,
        description = $3,
        frequency = $4,
        monthly_amount = $5,
        start_date = $6,
        end_date = $7,
        ongoing = $8,
        next_due_date = $9,
        responsible_person = $10,
        payment_terms = $11,
        notes = $12
      WHERE id = $13
      RETURNING *
      `, [
            data.category,
            data.item_name,
            data.description || null,
            data.frequency,
            Number(data.monthly_amount) || 0,
            data.start_date || null,
            data.end_date || null,
            (_a = data.ongoing) !== null && _a !== void 0 ? _a : true,
            data.next_due_date || null,
            data.responsible_person || null,
            data.payment_terms || null,
            data.notes || null,
            id,
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ UPDATE ERROR:", err);
        throw err;
    }
});
exports.updateSiteOverhead = updateSiteOverhead;
// ======================
// DELETE
// ======================
const deleteSiteOverhead = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      DELETE FROM site_overheads
      WHERE id = $1
      RETURNING *
      `, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ DELETE ERROR:", err);
        throw err;
    }
});
exports.deleteSiteOverhead = deleteSiteOverhead;
// ======================
// ADD PAYMENT
// ======================
const addPayment = (overheadId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { billing_period, amount_paid, paid_date, notes, } = data;
        const result = yield db_1.pool.query(`
      INSERT INTO overhead_payment_history (
        overhead_id,
        billing_period,
        amount_paid,
        paid_date,
        notes
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `, [
            overheadId,
            billing_period,
            Number(amount_paid) || 0,
            paid_date || null,
            notes || null,
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ PAYMENT ERROR:", err);
        throw err;
    }
});
exports.addPayment = addPayment;
