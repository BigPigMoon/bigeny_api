import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty({ description: 'ids of users in dialog', type: [Number] })
  users: number[];
  @ApiProperty({ description: 'ids of users in dialog', type: String })
  avatar: string | null;
  @ApiProperty({ description: 'ids of users in dialog', type: String })
  name: string;
}
