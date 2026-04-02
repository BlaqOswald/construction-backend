import { DataSource } from 'typeorm';
import { Project } from './src/entities/project.entity';
import { Activity } from './src/entities/activity.entity';
import { Milestone } from './src/entities/milestone.entity';
import { DailyLog } from './src/entities/daily-log.entity';
import { ResourceUsage } from './src/entities/resource-usage.entity';
import { Material } from './src/entities/material.entity';
import { LaborUsage } from './src/entities/labor-usage.entity';
import { Equipment } from './src/entities/equipment.entity';
import { SubcontractorCost } from './src/entities/subcontractor-cost.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'workshop',
  password: 'StrongPass!23',
  database: 'building',
  synchronize: false,          // keep false for production
  logging: false,
  entities: [
    Project,
    Activity,
    Milestone,
    DailyLog,
    ResourceUsage,
    Material,
    LaborUsage,
    Equipment,
    SubcontractorCost,
  ],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    migrationsDir: 'src/migration',
  },
});
