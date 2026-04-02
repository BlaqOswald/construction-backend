import { AppDataSource } from "../data-source";
import { DailyLog } from "../entities/daily-log.entity";

const repo = AppDataSource.getRepository(DailyLog);

export const createDailyLog = async (
  data: Partial<DailyLog> & { activityId: string }
) => {
  const activityRepo = AppDataSource.getRepository("activity");
  const activity = await activityRepo.findOneBy({ id: data.activityId });
  if (!activity) {
    const err: any = new Error("Activity not found");
    err.status = 404;
    throw err;
  }

  const log = repo.create({
    date: data.date,
    description: data.description,
    hoursSpent: data.hoursSpent,
    activity: activity as any,
  });
  return await repo.save(log);
};

export const getDailyLogs = async (activityId?: string) => {
  if (activityId) {
    return await repo.find({
      where: { activity: { id: activityId } },
      relations: ["activity"],
    });
  }
  return await repo.find({ relations: ["activity"] });
};
