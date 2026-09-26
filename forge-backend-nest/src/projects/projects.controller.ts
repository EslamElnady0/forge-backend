import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  forwardRef,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectService.createProject(createProjectDto);
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      ownerId: project.ownerId,
    };
  }

  @Get()
  async getProjects() {
    const projects = await this.projectService.getProjects();
    return { projects };
  }

  // Moved from /users/:id/projects -> now GET /projects/user/:userId
  @Get('user/:userId')
  async getUserProjects(@Param('userId', ParseIntPipe) userId: number) {
    const projects = await this.projectService.getUserProjects(userId);
    return { projects };
  }

  @Get(':id')
  async getProject(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectService.getProject(id);
    return { project };
  }

  @Patch(':id')
  async addMemberToProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const updatedProjectMessage = await this.projectService.addMemberToProject(
      id,
      addMemberDto.userId,
    );
    return {
      success: true,
      data: updatedProjectMessage,
    };
  }

  @Get(':id/members')
  async getProjectMembers(@Param('id', ParseIntPipe) id: number) {
    const projectMembers = await this.projectService.getProjectMembers(id);
    return { projectMembers };
  }

  @Get(':id/tasks')
  async getTasksByProject(@Param('id', ParseIntPipe) id: number) {
    const tasks = await this.tasksService.getTasksByProject(id);
    return { tasks };
  }
}
