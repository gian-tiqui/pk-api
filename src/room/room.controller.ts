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
import { RateLimit } from 'nestjs-rate-limiter';
import { AddDirectionDto } from './dto/add-direction.dto';

@Controller('room')
export class RoomController {
  private logger: Logger = new Logger('RoomController');

  constructor(private readonly roomService: RoomService) {}

  @Post()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before creating a new room.',
    keyPrefix: 'create-room',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading all rooms.',
    keyPrefix: 'get-rooms',
    points: 10,
  })
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

  @Post(':roomId/upload')
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before uploading images for a room.',
    keyPrefix: 'upload-room-image',
    points: 10,
  })
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

  @Post(':floorId/directions')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before adding the directions.',
    keyPrefix: 'room-directions',
    points: 10,
  })
  addDirection(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Body() addDirectionDto: AddDirectionDto,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.roomService.setRoomDirectionPattern(
        floorId,
        addDirectionDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':roomId/delete-images')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before deleting room images.',
    keyPrefix: 'delete-room-images',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a room.',
    keyPrefix: 'update-room',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before deleting a room.',
    keyPrefix: 'soft-delete-floor',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before purging the room.',
    keyPrefix: 'purge-room',
    points: 10,
  })
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
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before retrieving a room.',
    keyPrefix: 'retrieve-room',
    points: 10,
  })
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
