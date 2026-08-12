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
exports.lockProject = exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const db_1 = require("../../db");
const createProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`INSERT INTO projects (name, type, location, supervisor_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [
        data.name,
        data.type,
        data.location,
        data.supervisor_id || null,
    ]);
    return result.rows[0];
});
exports.createProject = createProject;
const getProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    return result.rows;
});
exports.getProjects = getProjects;
const getProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    return result.rows[0];
});
exports.getProject = getProject;
const updateProject = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`UPDATE projects
     SET name = $1,
         type = $2,
         location = $3
     WHERE id = $4
     RETURNING *`, [data.name, data.type, data.location, id]);
    return result.rows[0];
});
exports.updateProject = updateProject;
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return { message: "Project deleted successfully" };
});
exports.deleteProject = deleteProject;
const lockProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("UPDATE projects SET locked = true WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
});
exports.lockProject = lockProject;
