import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { pool } from "./db";

// routes
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import projectRoutes from "./modules/projects/projects.routes";
import taskRoutes from "./modules/tasks/tasks.routes";
import materialRoutes from "./modules/materials/materials.routes";
import subcontractorRoutes from "./modules/subcontractors/subcontractors.routes";
import reportRoutes from "./modules/reports/reports.routes";
import supplierRoutes from "./modules/suppliers/suppliers.routes";
import userRoutes from "./modules/users/users.routes";
import siteOverheadsRoutes from "./modules/siteoverheads/siteoverheads.routes";
import preDevelopmentRoutes from "./modules/predevelopment/predevelopment.routes";

const app = express();

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
app.use(express.json());

/**
 * =========================
 * CORS (PRODUCTION FIX)
 * =========================
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow mobile apps, postman, curl
      if (!origin) return callback(null, true);

      // allow localhost + ALL vercel deployments
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * =========================
 * FIX PREFLIGHT (IMPORTANT)
 * NO "*" HERE (CAUSES YOUR ERROR)
 * =========================
 */
app.options(/.*/, cors());

/**
 * =========================
 * REQUEST LOGGER
 * =========================
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(
    "📡",
    req.method,
    req.url,
    "| ORIGIN:",
    req.headers.origin
  );
  next();
});

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/materials", materialRoutes);
app.use("/subcontractors", subcontractorRoutes);
app.use("/reports", reportRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/site-overheads", siteOverheadsRoutes);
app.use("/predevelopment", preDevelopmentRoutes);

/**
 * =========================
 * ROOT TEST
 * =========================
 */
app.get("/", (_req: Request, res: Response) => {
  res.send("API working 🚀");
});

/**
 * =========================
 * DB CHECK
 * =========================
 */
pool
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
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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