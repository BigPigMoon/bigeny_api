import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({
    description: 'Access token of JWT tokens',
    example: 'salkdaskljfasklj.asdlkfjaldjf.lkasdjfljasdf',
  })
  AccessToken: string;

  @ApiProperty({
    description: 'Refresh token of JWT tokens',
    example: 'salkdaskljfasklj.asdlkfjaldjf.lkasdjfljasdf',
  })
  RefreshToken: string;
}
