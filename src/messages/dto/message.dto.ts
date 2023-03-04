import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageDto {
  @ApiProperty({ description: 'dialog id of message', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  dialogId: number;

  @ApiProperty({ description: 'content of message', example: 'Hello world' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
