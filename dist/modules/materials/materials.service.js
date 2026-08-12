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
exports.deleteMaterial = exports.updateMaterial = exports.getByProject = exports.addMaterial = void 0;
const db_1 = require("../../db");
// ======================
// CREATE / UPSERT MATERIAL
// Unique on (project_id, name) — prevents duplicates in reports
// ======================
const addMaterial = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id, name, unit_cost, quantity_used, currency, description, date_received, category, supplier_id, supplied_by, } = data;
        const result = yield db_1.pool.query(`INSERT INTO materials
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
       RETURNING *`, [
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
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ MATERIAL INSERT ERROR:", err);
        throw err;
    }
});
exports.addMaterial = addMaterial;
// ======================
// GET BY PROJECT
// Joins supplier name so the frontend doesn't need a second request
// ======================
const getByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT
         m.*,
         s.name AS supplier_name
       FROM materials m
       LEFT JOIN suppliers s ON s.id = m.supplier_id
       WHERE m.project_id = $1
       ORDER BY m.created_at DESC`, [projectId]);
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
const updateMaterial = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`UPDATE materials SET
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
       RETURNING *`, [
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
        ]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ UPDATE ERROR:", err);
        throw err;
    }
});
exports.updateMaterial = updateMaterial;
// ======================
// DELETE
// ======================
const deleteMaterial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`DELETE FROM materials WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.error("❌ DELETE ERROR:", err);
        throw err;
    }
});
exports.deleteMaterial = deleteMaterial;
