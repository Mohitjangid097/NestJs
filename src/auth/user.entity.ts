import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, {eager: true}) // eager: true => when true whenever we retrive the user as an object we can access user.task immeditely and get array of task of that user.
    tasks: Task[]

    async validatePassword(password: string){
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password
    }
}



