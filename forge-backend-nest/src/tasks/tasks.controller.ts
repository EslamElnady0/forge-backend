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

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.createTask(createTaskDto);
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
    };
  }

  @Get()
  async getTasks() {
    const tasks = await this.tasksService.getTasks();
    return { tasks };
  }

  @Get('project/:projectId')
  async getTasksByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    const tasks = await this.tasksService.getTasksByProject(projectId);
    return { tasks };
  }

  @Get('user/:userId')
  async getTasksByUser(@Param('userId', ParseIntPipe) userId: number) {
    const tasks = await this.tasksService.getTasksByAssignee(userId);
    return { tasks };
  }

  @Get('assignee/:assigneeId')
  async getTasksByAssignee(
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    const tasks = await this.tasksService.getTasksByAssignee(assigneeId);
    return { tasks };
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.getTask(id);
    return { task };
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.updateTask(id, updateTaskDto);
    return { task };
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.deleteTask(id);
    return { message: 'Task deleted successfully', task };
  }
}
