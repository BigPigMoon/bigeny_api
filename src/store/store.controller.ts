import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Public } from 'src/common/decorators';
import { randomUUID } from 'crypto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  @ApiOperation({
    summary: 'Upload image to server, return filepath img on server',
  })
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename(_, file, callback) {
          const filename = randomUUID();
          callback(null, `${filename}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadUserPic(@UploadedFile() file: Express.Multer.File): string {
    return file.filename;
  }

  @ApiOperation({ summary: 'Get image from server by img name on server' })
  @Public()
  @Get('/download/:img_url')
  async downloadAvatar(
    @Param('img_url') img_url: string,
    @Res() res,
  ): Promise<void> {
    const file = createReadStream(join('./uploads', img_url));
    file.pipe(res);
  }
}
