import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';

import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserOutput } from './types';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get all users from database without user from request',
  })
  @Get('/')
  getAllUsersWithOutMe(
    @GetCurrentUser('sub') self_id: number,
  ): Promise<UserOutput[]> {
    return this.usersService.getAllUsers(self_id);
  }

  @Get('/me')
  getMe(@GetCurrentUser('sub') id: number): Promise<UserOutput> {
    return this.usersService.getMe(id);
  }

  @Put('/updateAvatar')
  updateAvatar(
    @GetCurrentUser('sub') id: number,
    @Body() body: { filename: string },
  ) {
    return this.usersService.updateAvatar(id, body.filename);
  }

  @Put('updateDeviceToken')
  updateDeviceToken(
    @GetCurrentUser('sub') id: number,
    @Body() body: { deviceToken: string },
  ) {
    this.usersService.updateDeviceToken(id, body.deviceToken);
  }

  @Put('/changeNickname')
  async updateNickname(
    @GetCurrentUser('sub') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserOutput> {
    return this.usersService.updateNickname(id, dto);
  }

  @ApiOperation({ summary: 'Get some user by id' })
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserOutput> {
    return this.usersService.getUserById(id);
  }
}
