import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateTaskDto } from '../../application/dtos/create-task.dto';
import { UpdateTaskDto } from '../../application/dtos/update-task.dto';
import { CreateTaskCommand } from '../../application/commands/create-task.command';
import { UpdateTaskCommand } from '../../application/commands/update-task.command';
import { DeleteTaskCommand } from '../../application/commands/delete-task.command';
import { GetAllTasksQuery } from '../../application/queries/get-all-tasks.query';
import { GetTaskByIdQuery } from '../../application/queries/get-task-by-id.query';
import { GetTasksByProjectQuery } from '../../application/queries/get-tasks-by-project.query';
import { Task } from '../../domain/models/task.model';
import { InvalidateCache, CacheInvalidationInterceptor } from '../../../../shared/cache';
import { CacheTTLs } from '../../../../shared/cache/cache-keys';
import { PaginatedResult } from '../../../../shared/domain/pagination';
import { PaginationDto } from '../../../../shared/dtos/pagination.dto';
import { Result } from '../../../../shared/domain/result';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['tasks:all', 'tasks:project:*'] })
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const result = await this.commandBus.execute(
      new CreateTaskCommand(
        createTaskDto.title,
        createTaskDto.projectId,
        createTaskDto.description,
        createTaskDto.status,
        createTaskDto.priority,
        createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      ),
    );
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CacheTTLs.MEDIUM)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Paginated list of all tasks' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedResult<Task>> {
    return this.queryBus.execute(new GetAllTasksQuery(pagination));
  }

  @Get('project/:projectId')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CacheTTLs.MEDIUM)
  @ApiOperation({ summary: 'Get tasks by project ID' })
  @ApiResponse({ status: 200, description: 'Paginated list of tasks for the project' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async findByProject(
    @Param('projectId') projectId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResult<Task>> {
    return this.queryBus.execute(new GetTasksByProjectQuery(projectId, pagination));
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(CacheTTLs.SHORT)
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<Task> {
    const result = await this.queryBus.execute(new GetTaskByIdQuery(id));
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Put(':id')
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['tasks:all', 'tasks:project:*', 'tasks:id:*'], extractTaskId: true })
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const result = await this.commandBus.execute(
      new UpdateTaskCommand(
        id,
        updateTaskDto.title,
        updateTaskDto.description,
        updateTaskDto.status,
        updateTaskDto.priority,
        updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      ),
    );
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }

  @Delete(':id')
  @UseInterceptors(CacheInvalidationInterceptor)
  @InvalidateCache({ patterns: ['tasks:all', 'tasks:project:*', 'tasks:id:*'], extractTaskId: true })
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<boolean> {
    const result = await this.commandBus.execute(new DeleteTaskCommand(id));
    if (Result.isFail(result)) {
      throw result.error;
    }
    return result.data;
  }
}
