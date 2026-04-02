import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsOptional()
  durationHours?: number;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsUUID()
  projectId!: string;
}

