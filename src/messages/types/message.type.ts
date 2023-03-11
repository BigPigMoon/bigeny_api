import { ApiProperty } from '@nestjs/swagger';

export class MessageType {
  @ApiProperty({ description: 'id of message', example: '1' })
  id: number;

  @ApiProperty({ description: 'content of message', example: 'hello nouname!' })
  content: string;

  @ApiProperty({ description: 'date of creation message' })
  createdAt: Date;

  @ApiProperty({ description: 'message owner id', example: '3' })
  ownerId: number;

  @ApiProperty({ description: 'name of the user', example: 'user' })
  name: string;

  @ApiProperty({
    description: 'the user avatar of owner message',
    example: 'http://api.bigeny.ru/store/download/sldfjsljdfladjsf.jpg',
  })
  avatar: string;
}
