import { AppDataSource } from "../data-source";
import { Activity } from "../entities/activity.entity";

const repo = AppDataSource.getRepository(Activity);

export const createActivity = async (
  data: Partial<Activity> & { projectId: string }
) => {
  // verify project exists
  const projectRepo = AppDataSource.getRepository("project");
  const project = await projectRepo.findOneBy({ id: data.projectId });
  if (!project) {
    const err: any = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  const activity = repo.create({
    name: data.name,
    durationHours: data.durationHours,
    budget: data.budget,
    project: project as any,
  });
  return await repo.save(activity);
};

export const getActivities = async (projectId?: string) => {
  if (projectId) {
    return await repo.find({
      where: { project: { id: projectId } },
      relations: ["project"],
    });
  }
  return await repo.find({ relations: ["project"] });
};
