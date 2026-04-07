import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import projectRoutes from "./routes/project.routes";
import activityRoutes from "./routes/activity.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

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
app.use("/projects", projectRoutes);
app.use("/activities", activityRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

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
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

