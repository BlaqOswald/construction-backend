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
exports.deleteAttachment = exports.getAttachments = exports.addAttachment = exports.deleteCostItem = exports.updateCostItem = exports.getItemsByCategory = exports.addCostItem = exports.deleteCategory = exports.updateCategory = exports.getCategoriesByProject = exports.addCategory = void 0;
const db_1 = require("../../db");
// =============================
// CREATE CATEGORY
// =============================
const addCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id, name, status } = data;
        const result = yield db_1.pool.query(`
      INSERT INTO predev_categories
      (
        project_id,
        name,
        status
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `, [project_id, name, status || "Not Started"]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ CATEGORY INSERT ERROR:", err);
        throw err;
    }
});
exports.addCategory = addCategory;
// =============================
// GET CATEGORIES BY PROJECT (FIXED)
// =============================
const getCategoriesByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      SELECT
        c.id,
        c.name,
        c.project_id,
        c.status,
        c.created_at,

        COALESCE(SUM(i.amount_paid), 0) AS total_spent,
        COUNT(i.id) AS transactions

      FROM predev_categories c

      LEFT JOIN predev_cost_items i
        ON i.category_id = c.id

      WHERE c.project_id = $1

      GROUP BY
        c.id,
        c.name,
        c.project_id,
        c.status,
        c.created_at

      ORDER BY c.created_at DESC
      `, [projectId]);
        return result.rows;
    }
    catch (err) {
        console.error("❌ CATEGORY FETCH ERROR:", err);
        throw err;
    }
});
exports.getCategoriesByProject = getCategoriesByProject;
// =============================
// UPDATE CATEGORY
// =============================
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      UPDATE predev_categories
      SET
        name = $1,
        status = $2
      WHERE id = $3
      RETURNING *
      `, [data.name, data.status, id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ CATEGORY UPDATE ERROR:", err);
        throw err;
    }
});
exports.updateCategory = updateCategory;
// =============================
// DELETE CATEGORY
// =============================
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      DELETE FROM predev_categories
      WHERE id = $1
      RETURNING *
      `, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ CATEGORY DELETE ERROR:", err);
        throw err;
    }
});
exports.deleteCategory = deleteCategory;
// =============================
// CREATE COST ITEM
// =============================
const addCostItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id, item_name, description, amount_paid, date_paid, paid_to, invoice_number, status, notes, } = data;
        const result = yield db_1.pool.query(`
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `, [
            category_id,
            item_name,
            description || null,
            Number(amount_paid) || 0,
            date_paid || null,
            paid_to || null,
            invoice_number || null,
            status || "Paid",
            notes || null,
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ COST ITEM INSERT ERROR:", err);
        throw err;
    }
});
exports.addCostItem = addCostItem;
// =============================
// GET ITEMS BY CATEGORY
// =============================
const getItemsByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      SELECT *
      FROM predev_cost_items
      WHERE category_id = $1
      ORDER BY created_at DESC
      `, [categoryId]);
        return result.rows;
    }
    catch (err) {
        console.error("❌ ITEM FETCH ERROR:", err);
        throw err;
    }
});
exports.getItemsByCategory = getItemsByCategory;
// =============================
// UPDATE COST ITEM
// =============================
const updateCostItem = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
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
      `, [
            data.item_name,
            data.description || null,
            Number(data.amount_paid) || 0,
            data.date_paid || null,
            data.paid_to || null,
            data.invoice_number || null,
            data.status,
            data.notes || null,
            id,
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ COST ITEM UPDATE ERROR:", err);
        throw err;
    }
});
exports.updateCostItem = updateCostItem;
// =============================
// DELETE COST ITEM
// =============================
const deleteCostItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      DELETE FROM predev_cost_items
      WHERE id = $1
      RETURNING *
      `, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ COST ITEM DELETE ERROR:", err);
        throw err;
    }
});
exports.deleteCostItem = deleteCostItem;
// =============================
// ADD ATTACHMENT
// =============================
const addAttachment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cost_item_id, file_url } = data;
        const result = yield db_1.pool.query(`
      INSERT INTO predev_attachments
      (
        cost_item_id,
        file_url
      )
      VALUES ($1, $2)
      RETURNING *
      `, [cost_item_id, file_url]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ ATTACHMENT INSERT ERROR:", err);
        throw err;
    }
});
exports.addAttachment = addAttachment;
// =============================
// GET ATTACHMENTS
// =============================
const getAttachments = (costItemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      SELECT *
      FROM predev_attachments
      WHERE cost_item_id = $1
      ORDER BY uploaded_at DESC
      `, [costItemId]);
        return result.rows;
    }
    catch (err) {
        console.error("❌ ATTACHMENT FETCH ERROR:", err);
        throw err;
    }
});
exports.getAttachments = getAttachments;
// =============================
// DELETE ATTACHMENT
// =============================
const deleteAttachment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
      DELETE FROM predev_attachments
      WHERE id = $1
      RETURNING *
      `, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ ATTACHMENT DELETE ERROR:", err);
        throw err;
    }
});
exports.deleteAttachment = deleteAttachment;
