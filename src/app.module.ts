import { Module } from '@nestjs/common';
import { FloorModule } from './floor/floor.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DepartmentModule } from './department/department.module';
import { SecretQuestionModule } from './secret-question/secret-question.module';
import { ServerStatusModule } from './server-status/server-status.module';
import { ItemModule } from './item/item.module';
import { TransactionModule } from './transaction/transaction.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    FloorModule,
    UserModule,
    AuthModule,
    RoomModule,
    DepartmentModule,
    SecretQuestionModule,
    ServerStatusModule,
    ItemModule,
    TransactionModule,
    DoctorModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
