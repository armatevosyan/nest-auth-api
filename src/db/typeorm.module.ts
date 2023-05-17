import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { config } from 'dotenv';
config();

console.log('Server connected to the database', process.env.MYSQL_DATABASE);
@Module({
  imports: [
    NestTypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ['dist/**/entities/*.entity.js'],
      synchronize: true,
      logging: false,
    }),
  ],
})
export class TypeOrmModule {}
