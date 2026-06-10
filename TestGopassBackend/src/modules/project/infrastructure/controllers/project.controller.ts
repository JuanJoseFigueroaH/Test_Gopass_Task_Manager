import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateProjectDto } from '../../application/dtos/create-project.dto';
import { UpdateProjectDto } from '../../application/dtos/update-project.dto';
import { CreateProjectCommand } from '../../application/commands/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/delete-project.command';
import { GetAllProjectsQuery } from '../../application/queries/get-all-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/get-project-by-id.query';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { InvalidateCache, CacheInvalidationInterceptor } from '../../../../shared/cache';
import { CacheTTLs } from '../../../../shared/cache/cache-keys';
import { PaginatedResult } from '../../../../shared/domain/pagination';
import { PaginationDto } from '../../../../shared/dtos/pagination.dto';
import { Result } from '../../../../shared/domain/result';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { UserEntity } from '../../../auth/domain/entities/user.entity';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['projects:all'] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ProjectEntity> {
    const result = await this.commandBus.execute(
      new CreateProjectCommand(createProjectDto.name, createProjectDto.description, user.id),
    );
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CacheTTLs.MEDIUM)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects for current user' })
  @ApiResponse({ status: 200, description: 'Paginated list of user projects' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async findAll(
    @Query() pagination: PaginationDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PaginatedResult<ProjectEntity>> {
    return this.queryBus.execute(new GetAllProjectsQuery(pagination, user.id));
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CacheTTLs.SHORT)
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project found' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<ProjectEntity> {
    const result = await this.queryBus.execute(new GetProjectByIdQuery(id));
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Put(':id')
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['projects:all', 'projects:id:*'], extractProjectId: true })
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const result = await this.commandBus.execute(
      new UpdateProjectCommand(
        id,
        updateProjectDto.name,
        updateProjectDto.description,
        updateProjectDto.isActive,
      ),
    );
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Delete(':id')
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['projects:all', 'projects:id:*', 'tasks:project:*'], extractProjectId: true })
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(@Param('id') id: string): Promise<boolean> {
    const result = await this.commandBus.execute(new DeleteProjectCommand(id));
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }
}
