import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'content for new post',
    example: 'hello it is my first post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description:
      'path of image a new post (it may be null if post does not have any image)',
    example: 'https://bigeny.ru/store/aklsjdflkjsaf.png',
  })
  image: string | null;

  @ApiProperty({ description: 'id of channel for new post', example: '1' })
  @IsNumber()
  @IsNotEmpty()
  channelId: number;
}
