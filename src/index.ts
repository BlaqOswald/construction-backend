import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import { pool } from "./db";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// routes
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import projectRoutes from "./modules/projects/projects.routes";
import taskRoutes from "./modules/tasks/tasks.routes";
import materialRoutes from "./modules/materials/materials.routes";
import subcontractorRoutes from "./modules/subcontractors/subcontractors.routes";
import reportRoutes from "./modules/reports/reports.routes";
import userRoutes from "./modules/users/users.routes";

const app = express();

/**
 * =====================================================
 * 🔥 CORS - MUST BE FIRST (VERY IMPORTANT FIX)
 * =====================================================
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/**
 * 🔥 HANDLE PRE-FLIGHT REQUESTS (CRITICAL FIX)
 */
app.options("*", cors());

/**
 * PARSE JSON
 */
app.use(express.json());

/**
 * TRUST PROXY (FOR RENDER / NGROK)
 */
app.set("trust proxy", true);

/**
 * REQUEST LOGGER
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  console.log(
    "📡 REQUEST LOG -> IP:",
    ip,
    "METHOD:",
    req.method,
    "URL:",
    req.url
  );

  next();
});

/**
 * ROOT TEST
 */
app.get("/", (_req: Request, res: Response) => {
  res.send("API working 🚀");
});

/**
 * DB CHECK
 */
pool.query("SELECT NOW()")
  .then(res => {
    console.log("✅ DB CONNECTED:", res.rows[0]);
  })
  .catch(err => {
    console.error("❌ DB CONNECTION FAILED:", err);
  });

/**
 * ROUTES
 */
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/materials", materialRoutes);
app.use("/subcontractors", subcontractorRoutes);
app.use("/reports", reportRoutes);

/**
 * 404 HANDLER
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Global error]", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/**
 * START SERVER
 */
const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});