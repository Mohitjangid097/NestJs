import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'testDB',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, //every time when connection starts its going to syncup with the schema 

}

