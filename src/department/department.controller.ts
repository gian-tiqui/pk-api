import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindAllDto } from 'src/utils/common/find-all.dto';
import { RateLimit } from 'nestjs-rate-limiter';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @RateLimit({
    keyPrefix: 'create-department',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before creating a department.',
  })
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @RateLimit({
    keyPrefix: 'find-departments',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before loading departments.',
  })
  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.departmentService.findDepartments(query);
  }

  @RateLimit({
    keyPrefix: 'find-department-by-id',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before finding a department.',
  })
  @Get(':deptId')
  findOne(@Param('deptId', ParseIntPipe) deptId: number) {
    return this.departmentService.findDepartmentById(deptId);
  }

  @RateLimit({
    keyPrefix: 'update-department',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before updating a department.',
  })
  @Patch(':deptId')
  update(
    @Param('deptId', ParseIntPipe) deptId: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartmentById(
      deptId,
      updateDepartmentDto,
    );
  }

  @RateLimit({
    keyPrefix: 'delete-department',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait before deleting a department.',
  })
  @Delete(':deptId')
  remove(@Param('deptId', ParseIntPipe) deptId: number) {
    return this.departmentService.removeDepartmentById(deptId);
  }
}
