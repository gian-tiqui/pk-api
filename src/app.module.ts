import { Module } from '@nestjs/common';
import { FloorModule } from './floor/floor.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    FloorModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RoomModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
