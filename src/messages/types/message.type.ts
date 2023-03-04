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
}
