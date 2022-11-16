import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users from database' })
  @Get('/')
  getAllUsers() {
    return this.usersService.getAllUsers(0);
  }

  @ApiOperation({
    summary: 'Get all users from database without user from request',
  })
  @Get('/notme')
  getAllUsersWithOutMe(@GetCurrentUser('sub') self_id: number) {
    return this.usersService.getAllUsers(self_id);
  }

  @ApiOperation({ summary: 'Get some user by id' })
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
