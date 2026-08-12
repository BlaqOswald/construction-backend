"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getTaskLogs = exports.deleteTaskLog = exports.updateTaskLog = exports.addTaskLog = exports.deleteTask = exports.updateTask = exports.getByProject = exports.createTask = void 0;
const service = __importStar(require("./tasks.service"));
const getId = (val) => (Array.isArray(val) ? val[0] : val);
/* ================= TASKS ================= */
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.createTask(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating task" });
    }
});
exports.createTask = createTask;
const getByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = getId(req.params.projectId);
        const result = yield service.getByProject(projectId);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});
exports.getByProject = getByProject;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        const result = yield service.updateTask(id, req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating task" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        yield service.deleteTask(id);
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting task" });
    }
});
exports.deleteTask = deleteTask;
/* ================= TASK LOGS ================= */
const addTaskLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.addTaskLog(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: "Error adding log" });
    }
});
exports.addTaskLog = addTaskLog;
const updateTaskLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        const result = yield service.updateTaskLog(id, req.body);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating log" });
    }
});
exports.updateTaskLog = updateTaskLog;
const deleteTaskLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getId(req.params.id);
        yield service.deleteTaskLog(id);
        res.json({ message: "Log deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting log" });
    }
});
exports.deleteTaskLog = deleteTaskLog;
const getTaskLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = getId(req.params.projectId);
        const result = yield service.getTaskLogs(projectId);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching logs" });
    }
});
exports.getTaskLogs = getTaskLogs;
