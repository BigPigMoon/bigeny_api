import { ApiProperty } from '@nestjs/swagger';
import { PostType } from 'src/posts/types';

export class ChannelType {
  @ApiProperty({ description: 'id of channel', example: '1' })
  id: number;

  @ApiProperty({
    description: 'path on server to avatar image of channel',
    example: 'https://bigeny.ru/store/lksajdfljasdf.png',
  })
  avatar: string;

  @ApiProperty({
    description: 'descripton of channel',
    example: 'this is cool channel!',
  })
  description: string;

  @ApiProperty({ description: 'channel owner id', example: '1' })
  ownerId: number;

  @ApiProperty({ description: 'name of channel', example: 'cool channel' })
  name: string;

  @ApiProperty({ description: 'posts of channel', type: [PostType] })
  posts: PostType[];
}
