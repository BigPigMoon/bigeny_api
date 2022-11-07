import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({summary: 'Get all users from database'})
    @Get('/')
    getAllUsers() {
        return this.usersService.getAllUsers();
    }
}
