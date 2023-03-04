import { ApiProperty } from '@nestjs/swagger';

export class UserType {
  @ApiProperty({ description: 'id of the user', example: '1' })
  id: number;

  @ApiProperty({ description: 'email of the user', example: 'user@gmail.com' })
  email: string;

  @ApiProperty({ description: 'nickname of the user', example: 'user' })
  nickname: string;

  @ApiProperty({
    description: 'image for an avatar of the user ',
    example: 'https://bigeny.ru/store/laksdjfljsdf.png',
  })
  avatar: string | null;
}
