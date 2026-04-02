import { AppDataSource } from "../data-source";
import { Milestone } from "../entities/milestone.entity";

const repo = AppDataSource.getRepository(Milestone);

export const createMilestone = async (
  data: Partial<Milestone> & { projectId: string }
) => {
  const projectRepo = AppDataSource.getRepository("project");
  const project = await projectRepo.findOneBy({ id: data.projectId });
  if (!project) {
    const err: any = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  const milestone = repo.create({
    title: data.title,
    dueDate: data.dueDate,
    project: project as any,
  });
  return await repo.save(milestone);
};

export const getMilestones = async (projectId?: string) => {
  if (projectId) {
    return await repo.find({
      where: { project: { id: projectId } },
      relations: ["project"],
    });
  }
  return await repo.find({ relations: ["project"] });
};
