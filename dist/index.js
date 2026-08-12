"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
dns_1.default.setDefaultResultOrder("ipv4first");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
// routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const projects_routes_1 = __importDefault(require("./modules/projects/projects.routes"));
const tasks_routes_1 = __importDefault(require("./modules/tasks/tasks.routes"));
const materials_routes_1 = __importDefault(require("./modules/materials/materials.routes"));
const subcontractors_routes_1 = __importDefault(require("./modules/subcontractors/subcontractors.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/reports.routes"));
const suppliers_routes_1 = __importDefault(require("./modules/suppliers/suppliers.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const siteoverheads_routes_1 = __importDefault(require("./modules/siteoverheads/siteoverheads.routes"));
const predevelopment_routes_1 = __importDefault(require("./modules/predevelopment/predevelopment.routes"));
const app = (0, express_1.default)();
/**
 * =========================
 * TRUST PROXY (Render)
 * =========================
 */
app.set("trust proxy", true);
/**
 * =========================
 * JSON BODY PARSER
 * =========================
 */
app.use(express_1.default.json());
/**
 * =========================
 * CORS (PRODUCTION FIX)
 * =========================
 */
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow mobile apps, postman, curl
        if (!origin)
            return callback(null, true);
        // allow localhost + ALL vercel deployments
        if (origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        console.log("❌ BLOCKED CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
/**
 * =========================
 * FIX PREFLIGHT (IMPORTANT)
 * NO "*" HERE (CAUSES YOUR ERROR)
 * =========================
 */
app.options(/.*/, (0, cors_1.default)());
/**
 * =========================
 * REQUEST LOGGER
 * =========================
 */
app.use((req, _res, next) => {
    console.log("📡", req.method, req.url, "| ORIGIN:", req.headers.origin);
    next();
});
/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/dashboard", dashboard_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/projects", projects_routes_1.default);
app.use("/users", users_routes_1.default);
app.use("/tasks", tasks_routes_1.default);
app.use("/materials", materials_routes_1.default);
app.use("/subcontractors", subcontractors_routes_1.default);
app.use("/reports", reports_routes_1.default);
app.use("/suppliers", suppliers_routes_1.default);
app.use("/site-overheads", siteoverheads_routes_1.default);
app.use("/predevelopment", predevelopment_routes_1.default);
/**
 * =========================
 * ROOT TEST
 * =========================
 */
app.get("/", (_req, res) => {
    res.send("API working 🚀");
});
/**
 * =========================
 * DB CHECK
 * =========================
 */
db_1.pool
    .query("SELECT NOW()")
    .then((res) => {
    console.log("✅ DB CONNECTED:", res.rows[0]);
})
    .catch((err) => {
    console.error("❌ DB FAILED:", err);
});
/**
 * =========================
 * 404 HANDLER
 * =========================
 */
app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
});
/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err, _req, res, _next) => {
    console.error("🔥 ERROR:", err.message);
    res.status(500).json({
        message: err.message || "Internal Server Error",
    });
});
/**
 * =========================
 * START SERVER
 * =========================
 */
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
