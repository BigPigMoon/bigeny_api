import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { UserType } from './types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get all users from database without user from request',
  })
  @ApiResponse({ type: [UserType] })
  @Get('/')
  getAllUsersWithOutMe(
    @GetCurrentUser('sub') self_id: number,
  ): Promise<UserType[]> {
    return this.usersService.getAllUsers(self_id);
  }

  @ApiOperation({
    summary: 'Get user by self id in JWT token',
  })
  @ApiResponse({ type: UserType })
  @Get('/me')
  getMe(@GetCurrentUser('sub') id: number): Promise<UserType> {
    return this.usersService.getMe(id);
  }

  @ApiOperation({
    summary: 'Update Avatar for user after storing image',
  })
  @ApiResponse({ type: UserType })
  @Put('/updateAvatar')
  updateAvatar(
    @GetCurrentUser('sub') id: number,
    @Body() body: { filename: string },
  ): Promise<UserType> {
    return this.usersService.updateAvatar(id, body.filename);
  }

  @ApiOperation({
    summary: 'Aupdate device token for push (Android only)',
  })
  @ApiResponse({ type: null })
  @Put('updateDeviceToken')
  updateDeviceToken(
    @GetCurrentUser('sub') id: number,
    @Body() body: { deviceToken: string },
  ): void {
    this.usersService.updateDeviceToken(id, body.deviceToken);
  }

  @ApiOperation({
    summary: 'Change nickname for current user',
  })
  @ApiResponse({ type: UserType })
  @Put('/changeNickname')
  async updateNickname(
    @GetCurrentUser('sub') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserType> {
    return this.usersService.updateNickname(id, dto);
  }

  @ApiOperation({ summary: 'Get some user by id' })
  @ApiResponse({ type: UserType })
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserType> {
    return this.usersService.getUserById(id);
  }
}
