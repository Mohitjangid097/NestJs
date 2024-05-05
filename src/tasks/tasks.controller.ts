import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto):Task[] {
        if(Object.keys(filterDto).length){
            return this.tasksService.getTaskWithFilters(filterDto)
        }else{
            return this.tasksService.getAllTasks() 
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    // @Post()
    // createTask(@Body() body){
    //     console.log("body", body)
    // }

    // @Post()
    // createTask(@Body('title') title: string, @Body('description') description: string ): Task{
    //     return this.tasksService.createTask(title, description);
    // }

    @Post()
    @UsePipes(ValidationPipe) // add validation that title and description can't be empty
    createTask(@Body() CreateTaskDto: CreateTaskDto ): Task{
        return this.tasksService.createTask(CreateTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id:string){
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus){
        console.log("param", id, status)
        return this.tasksService.updateTask(id, status)
    }
}


