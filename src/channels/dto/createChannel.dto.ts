import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({})
  description: string | null;
  @ApiProperty({ description: 'ids of users in dialog', type: String })
  avatar: string | null;
  @ApiProperty({ description: 'ids of users in dialog', type: String })
  name: string;
}
