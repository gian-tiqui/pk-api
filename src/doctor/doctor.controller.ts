import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.doctorService.findAll(query);
  }

  @Get(':doctorId')
  findOne(@Param('doctorId') doctorId: number) {
    return this.doctorService.findOne(+doctorId);
  }

  @Patch(':doctorId')
  update(
    @Param('doctorId') doctorId: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.update(+doctorId, updateDoctorDto);
  }

  @Delete(':doctorId')
  remove(@Param('doctorId') doctorId: number) {
    return this.doctorService.remove(+doctorId);
  }
}
