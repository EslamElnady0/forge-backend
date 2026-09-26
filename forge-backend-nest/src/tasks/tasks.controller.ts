import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const task = await this.tasksService.createTask(
      createTaskDto,
      userId,
      userRole,
    );
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
    };
  }

  @Get()
  async getTasks(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const tasks = await this.tasksService.getTasks(userId, userRole);
    return { tasks };
  }

  @Get('project/:projectId')
  async getTasksByProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const tasks = await this.tasksService.getTasksByProject(
      projectId,
      userId,
      userRole,
    );
    return { tasks };
  }

  @Get('user/:userId')
  async getTasksByUser(
    @Param('userId', ParseIntPipe) targetUserId: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const tasks = await this.tasksService.getTasksByAssignee(
      targetUserId,
      userId,
      userRole,
    );
    return { tasks };
  }

  @Get('assignee/:assigneeId')
  async getTasksByAssignee(
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const tasks = await this.tasksService.getTasksByAssignee(
      assigneeId,
      userId,
      userRole,
    );
    return { tasks };
  }

  @Get(':id')
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const task = await this.tasksService.getTask(id, userId, userRole);
    return { task };
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.updateTask(
      id,
      updateTaskDto,
      userId,
      userRole,
    );
    return { task };
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const result = await this.tasksService.deleteTask(id, userId, userRole);
    return { message: 'Task deleted successfully', task: result };
  }
}
