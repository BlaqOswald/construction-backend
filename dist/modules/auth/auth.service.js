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
exports.loginUser = exports.findUserByEmail = void 0;
const db_1 = require("../../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
});
exports.findUserByEmail = findUserByEmail;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUserByEmail)(email);
    if (!user) {
        throw new Error("User not found");
    }
    // FIRST LOGIN TEMP PASSWORD FLOW
    if (user.must_set_password) {
        if (password !== user.temp_password) {
            throw new Error("Invalid temporary password");
        }
        return {
            requiresPasswordChange: true,
            email: user.email,
        };
    }
    // NORMAL LOGIN
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        projectIds: user.project_ids || [],
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            projectIds: user.project_ids || [],
        },
    };
});
exports.loginUser = loginUser;
