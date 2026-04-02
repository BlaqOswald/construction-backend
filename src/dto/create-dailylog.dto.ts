import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
} from "class-validator";

export class CreateDailyLogDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  hoursSpent?: number;

  @IsUUID()
  activityId!: string;
}
