import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import * as config from 'config'

const dbConfig = config.get('db')

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: dbConfig.synchronize, //every time when connection starts its going to syncup with the schema 

}),
    TasksModule,
    AuthModule
  ]
})
export class AppModule {}
