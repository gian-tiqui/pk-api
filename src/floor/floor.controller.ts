import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
  BadRequestException,
  // UseGuards,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import errorHandler from 'src/utils/functions/errorHandler';
// import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractAccessToken from 'src/utils/functions/extractAccessToken';
import {
  Create,
  FindMany,
  FindOne,
  RemoveById,
  UpdateById,
} from 'src/utils/types/types';
import { RateLimit } from 'nestjs-rate-limiter';
import { FileInterceptor } from '@nestjs/platform-express';

// @UseGuards(JwtAuthGuard)
@Controller('floor')
export class FloorController {
  private logger: Logger = new Logger('FloorController');

  constructor(private readonly floorService: FloorService) {}

  @Post()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before creating a new floor.',
    keyPrefix: 'create-floor',
    points: 10,
  })
  create(
    @Body() createFloorDto: CreateFloorDto,
    @Req() req: Request,
  ): Promise<Create> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.createFloor(createFloorDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading all floors.',
    keyPrefix: 'get-floors',
    points: 10,
  })
  findAll(@Query() query: FindAllDto): Promise<FindMany> {
    return this.floorService.findFloors(query);
  }

  @Get(':floorId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading a floor.',
    keyPrefix: 'get-floor-by-id',
    points: 10,
  })
  findOne(@Param('floorId', ParseIntPipe) floorId: number): Promise<FindOne> {
    return this.floorService.findFloorById(floorId);
  }

  @Get(':floorId/room')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading the rooms of a floor.',
    keyPrefix: 'get-floor-rooms-by-floor-id',
    points: 10,
  })
  findFloorRooms(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Query() query: FindAllDto,
  ): Promise<FindMany> {
    return this.floorService.findFloorRooms(floorId, query);
  }

  @Get(':floorId/room/:roomId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before loading the room of a floor.',
    keyPrefix: 'get-floor-room-by-floor-id-and-room-id',
    points: 10,
  })
  findFloorRoom(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<FindOne> {
    return this.floorService.findFloorRoomByIds(floorId, roomId);
  }

  @Patch(':floorId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a floor.',
    keyPrefix: 'update-floor-by-id',
    points: 10,
  })
  update(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Body() updateFloorDto: UpdateFloorDto,
    @Req() req: Request,
  ): Promise<UpdateById> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.updateFloorById(
        floorId,
        updateFloorDto,
        accessToken,
      );
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':floorId/upload')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before updating a floor.',
    keyPrefix: 'update-floor-by-id',
    points: 10,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  upload(
    @Param('floorId', ParseIntPipe) floorId: number,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      return this.floorService.uploadFloorMapById(floorId, file, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':floorId/soft-delete')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before soft deleting a floor.',
    keyPrefix: 'soft-delete-floor-by-id',
    points: 10,
  })
  softRemove(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Req() req: Request,
  ): Promise<RemoveById> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.softDeleteFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':floorId')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before deleting a floor.',
    keyPrefix: 'delete-floor-by-id',
    points: 10,
  })
  remove(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Req() req: Request,
  ): Promise<RemoveById> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.deleteFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':floorId/retrieve')
  @RateLimit({
    duration: 60,
    errorMessage: 'Please wait before retrieving a floor by id.',
    keyPrefix: 'retrieve-floor-by-id',
    points: 10,
  })
  retrieve(
    @Param('floorId', ParseIntPipe) floorId,
    @Req() req: Request,
  ): Promise<RemoveById> {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.retrieveFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
