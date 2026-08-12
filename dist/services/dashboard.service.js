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
exports.getProjectDashboard = void 0;
const db_1 = require("../db");
const getProjectDashboard = (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Project check
    const projectResult = yield db_1.pool.query(`SELECT * FROM project WHERE id = $1 AND user_id = $2`, [projectId, userId]);
    const project = projectResult.rows[0];
    if (!project) {
        throw new Error("Project not found or access denied");
    }
    // ---------------------------
    // 2. FAST SQL METRICS (NO JS LOOPS)
    // ---------------------------
    const activityStats = yield db_1.pool.query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed,
      COALESCE(SUM(cost), 0) AS total_cost
    FROM activity
    WHERE project_id = $1
    `, [projectId]);
    const taskStats = yield db_1.pool.query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
    FROM task
    WHERE project_id = $1
    `, [projectId]);
    const activity = activityStats.rows[0];
    const task = taskStats.rows[0];
    // ---------------------------
    // 3. CONVERT RESULTS
    // ---------------------------
    const totalActivities = Number(activity.total);
    const completedActivities = Number(activity.completed);
    const totalCost = Number(activity.total_cost);
    const totalTasks = Number(task.total);
    const completedTasks = Number(task.completed);
    // ---------------------------
    // 4. PROGRESS CALCULATION
    // ---------------------------
    const activityProgress = totalActivities === 0
        ? 0
        : (completedActivities / totalActivities) * 100;
    const taskProgress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    // ---------------------------
    // 5. FINANCIALS
    // ---------------------------
    const budget = Number(project.budget || 0);
    const remainingBudget = budget - totalCost;
    // ---------------------------
    // 6. OVERALL INTELLIGENCE
    // ---------------------------
    const overallProgress = Math.round(activityProgress * 0.6 + taskProgress * 0.4);
    let health = "EXCELLENT";
    if (remainingBudget < 0) {
        health = "OVER BUDGET";
    }
    else if (overallProgress < 40 && totalCost > budget * 0.6) {
        health = "RISK";
    }
    else if (overallProgress < 70) {
        health = "MODERATE";
    }
    // ---------------------------
    // 7. RESPONSE
    // ---------------------------
    return {
        project: project.name,
        budget,
        current_spend: totalCost,
        remaining_budget: remainingBudget,
        total_activities: totalActivities,
        completed_activities: completedActivities,
        activity_progress: Math.round(activityProgress),
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        task_progress: Math.round(taskProgress),
        overall_progress: overallProgress,
        health,
    };
});
exports.getProjectDashboard = getProjectDashboard;
