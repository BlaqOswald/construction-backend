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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.getUsers = exports.createUser = void 0;
const db_1 = require("../../db");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * CREATE USER (ADMIN ONLY)
 * Stored in PostgreSQL
 */
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_1.v4)();
    const tempPassword = data.tempPassword || "123456";
    yield db_1.pool.query(`
    INSERT INTO users (
      id,
      name,
      email,
      role,
      password,
      temp_password,
      must_set_password
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
        id,
        data.name,
        data.email,
        data.role,
        null, // password not set yet
        tempPassword,
        true,
    ]);
    return {
        id,
        name: data.name,
        email: data.email,
        role: data.role,
        tempPassword,
        mustSetPassword: true,
    };
});
exports.createUser = createUser;
/**
 * GET ALL USERS (ADMIN ONLY)
 */
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM users ORDER BY created_at DESC");
    return result.rows;
});
exports.getUsers = getUsers;
/**
 * SET PASSWORD (FIRST LOGIN FLOW)
 */
const setPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashed = yield bcrypt_1.default.hash(password, 10);
    const result = yield db_1.pool.query(`
    UPDATE users
    SET password = $1,
        temp_password = NULL,
        must_set_password = false
    WHERE email = $2
    RETURNING id, email
    `, [hashed, email]);
    if (result.rowCount === 0) {
        throw new Error("User not found");
    }
    return {
        message: "Password set successfully",
    };
});
exports.setPassword = setPassword;
