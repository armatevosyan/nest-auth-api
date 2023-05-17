import { Module } from '@nestjs/common';

//importing modules
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from './db/typeorm.module';
import { AppController } from './app.controller';
import { ConfigModule } from './config.module';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, TypeOrmModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
