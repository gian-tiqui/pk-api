import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
  Logger,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Messages } from 'src/utils/enums/enum';
import errorHandler from 'src/utils/functions/errorHandler';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import { Create, FindMany } from 'src/utils/types/types';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  private logger: Logger = new Logger('RoomController');

  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: Request,
  ): Promise<Create> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.createRoom(createRoomDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  findAll(@Query() query: FindAllDto): Promise<FindMany> {
    return this.roomService.findRooms(query);
  }

  @Get(':roomId')
  findOne(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() query: FindAllDto,
  ) {
    return this.roomService.findRoomById(roomId, query);
  }

  @Patch(':roomId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(Messages.IMAGES_ERROR), false);
        }
      },
    }),
  )
  upload(
    @Param('roomId', ParseIntPipe) roomId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.uploadRoomPhotosById(roomId, files, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':roomId/delete-images')
  unbindRoomSelectedImages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('imageIds') imageIds: string,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.deleteSelectedRoomImages(
        roomId,
        imageIds,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':roomId')
  update(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.updateRoomById(
        roomId,
        updateRoomDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':roomId/soft-delete')
  softRemove(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.softRemoveRoomById(roomId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':roomId')
  remove(@Param('roomId', ParseIntPipe) roomId: number, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.deleteRoomById(roomId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':roomId/retrieve')
  retrieve(@Param('roomId', ParseIntPipe) roomId: number, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.roomService.retrieveRoomById(roomId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
