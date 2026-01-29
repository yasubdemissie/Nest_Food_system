import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ForbiddenException,
  UseFilters,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { HttpExceptionFilter } from 'src/Exceptions/CustomHttpException';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  create(@Body() createAdminDto: CreateAdminDto) {
    try {
      if (createAdminDto) {
        return `Good to go. with ${createAdminDto.name}`;
      } else
        throw new HttpException(
          'This is my personal error! 😂',
          HttpStatus.FORBIDDEN,
        );
    } catch (error) {
      throw new ForbiddenException("You can't acces this data!", {
        cause: error,
        description:
          "This is happening because you're trying to access beyond your ROLE.",
      });
    }
    // return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
