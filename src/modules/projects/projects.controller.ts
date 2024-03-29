import {
  Controller,
  Body,
  Param,
  Res,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import e, { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { ProjectsService } from './projects.service';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { ProjectsResource } from './resources/projects.resource';

@ApiTags('Projects')
@Controller('api')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, type: [ProjectsResource] })
  @Get('/projects')
  public async getAll(): Promise<ProjectsResource[]> {
    const projects = await this.projectsService.getAll();
    return ProjectsResource.collect(projects);
  }

  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, type: ProjectsResource })
  @Get('project/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectsResource> {
    const project = await this.projectsService.getById(id);
    return new ProjectsResource(project);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 201, type: ProjectsResource })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @Patch('project/:id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: ProjectUpdateDto,
  ): Promise<ProjectsResource> {
    const project = await this.projectsService.update(id, projectDto);
    return new ProjectsResource(project);
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 204, description: 'No content' })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(204)
  @Delete('project/:id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<e.Response<any, Record<string, any>>> {
    await this.projectsService.delete(id);
    return response
      .status(HttpStatus.NO_CONTENT)
      .send('saving ' + JSON.stringify(id));
  }
}
