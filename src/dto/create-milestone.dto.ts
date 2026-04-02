import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from "class-validator";

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsUUID()
  projectId!: string;
}
