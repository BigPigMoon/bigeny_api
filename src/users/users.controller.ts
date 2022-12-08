import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { createReadStream } from 'fs';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

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

  @Get('/me')
  getMe(@GetCurrentUser('sub') id: number) {
    return this.usersService.getMe(id);
  }

  @Post('/uploadAvatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename(_, file, callback) {
          const filename = uuidv4();
          callback(null, `${filename}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadUserPic(
    @GetCurrentUser('sub') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return this.usersService.uploadAvatar(id, file);
  }

  @Public()
  @Get('/downloadAvatar/:img_url')
  async downloadAvatar(@Param('img_url') img_url: string, @Res() res) {
    const file = createReadStream(join('./uploads/avatars', img_url));
    file.pipe(res);
  }

  @ApiOperation({ summary: 'Get some user by id' })
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
