import { ApiProperty } from '@nestjs/swagger';

export class RateType {
  @ApiProperty({ description: 'rate of post', example: '124' })
  rate: number;

  @ApiProperty({
    description:
      'user like (ture - user liked this post, false - user do not liked)',
    example: 'true',
  })
  userRate: boolean;
}
