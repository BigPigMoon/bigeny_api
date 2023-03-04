import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDialogDto {
  @ApiProperty({ description: 'ids of users in new dialog', type: [Number] })
  users: number[];

  @ApiProperty({
    description: 'path to avatar for new dialog',
    example: 'https://bigeny.ru/store/lksadjfljasd.png',
  })
  @IsString()
  avatar: string | null;

  @ApiProperty({ description: 'name for new dialog', example: 'cool dialog' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
