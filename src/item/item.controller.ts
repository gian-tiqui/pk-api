import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Controller('item')
export class ItemController {
  private logger: Logger = new Logger('ItemController');

  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.itemService.findAll(query);
  }

  @Get(':itemId')
  findOne(@Param('itemId') itemId: string) {
    return this.itemService.findOne(itemId);
  }

  @Patch(':itemId')
  update(
    @Param('itemId') itemId: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(+itemId, updateItemDto);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: number) {
    return this.itemService.remove(+itemId);
  }
}
