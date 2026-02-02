import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerInterceptor } from 'src/interceptor/logger.interceptor';
import { UserParserPipe } from 'src/pipe/user.pipe';

@UseInterceptors(LoggerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  // POST /user - Create a new user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(UserParserPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // GET /user - Get all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /user/stats - Get user statistics
  @Get('stats')
  getUserStats() {
    return this.userService.getUserStats();
  }

  // GET /user/search?q=query - Search users
  @Get('search')
  searchUsers(@Query('q') query: string) {
    return this.userService.searchUsers(query);
  }

  // GET /user/email/:email - Get user by email
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  // GET /user/:id - Get user by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // PATCH /user/:id - Update user
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // DELETE /user/:id - Delete user
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
