import {
  Body,
  Controller,
  Delete,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @CurrentUser('id') userId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.createProject({
      ...createProjectDto,
      ownerId: userId,
    });

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      ownerId: project.ownerId,
    };
  }

  @Get()
  async getProjects(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const projects = await this.projectService.getProjects(userId, userRole);
    return { projects };
  }

  @Get(':id')
  async getProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const project = await this.projectService.getProject(id, userId, userRole);
    return { project };
  }

  @Patch(':id/members')
  async addMemberToProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') callerUserId: number,
    @CurrentUser('role') userRole: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const result = await this.projectService.addMemberToProject(
      id,
      addMemberDto.userId,
      callerUserId,
      userRole,
    );

    return {
      success: true,
      message: result,
    };
  }

  @Get(':id/members')
  async getProjectMembers(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const projectMembers = await this.projectService.getProjectMembers(
      id,
      userId,
      userRole,
    );
    return { projectMembers };
  }

  @Get(':id/tasks')
  async getTasksByProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const tasks = await this.tasksService.getTasksByProject(
      id,
      userId,
      userRole,
    );
    return { tasks };
  }

  @Delete(':id')
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') callerUserId: number,
    @CurrentUser('role') userRole: string,
  ) {
    const result = await this.projectService.deleteProject(
      id,
      callerUserId,
      userRole,
    );
    return { message: 'Project deleted successfully', project: result };
  }
}
