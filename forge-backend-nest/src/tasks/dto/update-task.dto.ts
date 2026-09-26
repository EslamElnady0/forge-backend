import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(TaskStatus, {
    message: 'invalid status, use TODO, IN_PROGRESS, or DONE only',
  })
  @IsOptional()
  status?: TaskStatus;

  @IsInt()
  @IsPositive()
  @IsOptional()
  projectId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  assigneeId?: number | null;
}
