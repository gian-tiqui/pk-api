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
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import errorHandler from 'src/utils/functions/errorHandler';
// import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import extractAccessToken from 'src/utils/functions/extractAccessToken';

// @UseGuards(JwtAuthGuard)
@Controller('floor')
export class FloorController {
  private logger: Logger = new Logger('FloorController');

  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() createFloorDto: CreateFloorDto, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.createFloor(createFloorDto, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.floorService.findFloors(query);
  }

  @Get(':floorId')
  findOne(@Param('floorId', ParseIntPipe) floorId: number) {
    return this.floorService.findFloorById(floorId);
  }

  @Get(':floorId/room')
  findFloorRooms(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Query() query: FindAllDto,
  ) {
    return this.floorService.findFloorRooms(floorId, query);
  }

  @Get(':floorId/room/:roomId')
  findFloorRoom(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.floorService.findFloorRoomByIds(floorId, roomId);
  }

  @Patch(':floorId')
  update(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Body() updateFloorDto: UpdateFloorDto,
    @Req() req: Request,
  ) {
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

  @Delete(':floorId/soft-delete')
  softRemove(
    @Param('floorId', ParseIntPipe) floorId: number,
    @Req() req: Request,
  ) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.softDeleteFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Delete(':floorId')
  remove(@Param('floorId', ParseIntPipe) floorId: number, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.deleteFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  @Patch(':floorId/retrieve')
  retrieve(@Param('floorId', ParseIntPipe) floorId, @Req() req: Request) {
    try {
      const accessToken = extractAccessToken(req);

      if (!accessToken) throw new BadRequestException(`Token is missing`);

      return this.floorService.retrieveFloorById(floorId, accessToken);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
