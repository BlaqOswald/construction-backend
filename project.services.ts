import { AppDataSource } from "../data-source";
import { Project } from "../entities/project.entity";

const repo = AppDataSource.getRepository(Project);

export const createProject = async (data: Partial<Project>) => {
  const project = repo.create(data);
  return await repo.save(project);
};

export const getProjects = async () => {
  return await repo.find();
};
