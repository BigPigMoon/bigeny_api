import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  dialogId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
