import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService')
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ){}

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>{
       try {
            const {status, search} = filterDto;
            const query = this.taskRepository.createQueryBuilder('task');
            
            query.where('task.userId = :userId', {userId: user.id});
            
            if(status){
                query.andWhere('task.status = :status', {status})
            }
            if(search){
                query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
            }
            const tasks = await query.getMany()
        
            return tasks;
       } catch (error) {
            this.logger.error(`Failed to get task for user "${user.username}". DTO: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException();
       }
    }

    // private tasks:Task[] = [];

    // getAllTasks():Task[] {
    //     return this.tasks;
    // }

    // getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status === status) 
    //     }

    //     if(search){
    //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
    //     }

    //     return tasks;
    // }

    // createTask(CreateTaskDto: CreateTaskDto): Task {
    //     const {title, description} = CreateTaskDto
    //     const task:Task = {
    //         id: uuidv4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    async createTask(CreateTaskDto: CreateTaskDto, user: User): Promise<Task>{
        try {
            const {title, description} = CreateTaskDto;
            const task = new Task();
            task.title = title;
            task.description = description;
            task.status = TaskStatus.OPEN;
            task.user = user;
            await this.taskRepository.save(task)
            delete task.user;

            return task;
        } catch (error) {
            this.logger.error(`Failed to create a task for user "${user.username}". Data: ${JSON.stringify(CreateTaskDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async getTaskById(id: number, user:User): Promise<Task>{
        console.log("id-2", id)
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if(!found){  
            throw new NotFoundException(`Task with ID "${id}" not found`); 
        }

        return found;
    }

    async deleteTask(id: number, user:User): Promise<void>{
        const result = await this.taskRepository.delete({ id, userId: user.id });
        console.log(result)
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTask(id:number, status: TaskStatus, user: User): Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        console.log("taskk", task)
        return task
    }
    

    // getTaskById(id: string): Task{
    //     const found = this.tasks.find(task => task.id === id);

    //     if(!found){
    //         throw new NotFoundException(`Task with ID "${id}" not found`);
    //     }
    //     return found;
    // }

    // deleteTask(id:string){
    //     const found = this.getTaskById(id)
    //     this.tasks =  this.tasks.filter(task => task.id !== found.id)
    //     return this.tasks;
    // }

    // updateTask(id:string, status: TaskStatus):Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task
    // }

}
