import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import projectRoutes from "./modules/projects/projects.routes";
import taskRoutes from "./modules/tasks/tasks.routes";
import materialRoutes from "./modules/materials/materials.routes";
import subcontractorRoutes from "./modules/subcontractors/subcontractors.routes";
import reportRoutes from "./modules/reports/reports.routes";
import userRoutes from "./modules/users/users.routes";

const app = express();

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// ROOT TEST
// ----------------------------------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("API working 🚀");
});
pool.query("SELECT NOW()")
  .then(res => {
    console.log("✅ DB CONNECTED:", res.rows[0]);
  })
  .catch(err => {
    console.error("❌ DB CONNECTION FAILED:", err);
  });
// ----------------------------------------------------
// ROUTES (IMPORTANT ORDER)
// ----------------------------------------------------

app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/materials", materialRoutes);
app.use("/subcontractors", subcontractorRoutes);
app.use("/reports", reportRoutes);
// ----------------------------------------------------
// 404 HANDLER (MUST BE LAST)
// ----------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// ----------------------------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------------------------
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[Global error]", err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

