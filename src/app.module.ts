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

@Module({
  imports: [
    FloorModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      // URL Structure: http://localhost:8083/uploads/room_images/2-1738052403796-328735966-download.jpg
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RoomModule,
    DepartmentModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
