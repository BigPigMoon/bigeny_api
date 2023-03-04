import { ApiProperty } from '@nestjs/swagger';

export class PostType {
  @ApiProperty({ description: 'id of the post', example: '1' })
  id: number;

  @ApiProperty({
    description: 'them date when the post was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'content of the post',
    example: 'it is test a post!',
  })
  content: string;

  @ApiProperty({
    description: 'image of the post',
    example: 'https://bigeny.ru/store/lsajdflajs.png',
  })
  image: string | null;

  @ApiProperty({
    description: 'ID of the channel where the post was published',
    example: '2',
  })
  channelId: number;
}
