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
@Controller('store')
export class StoreController {
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
