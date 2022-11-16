import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty({ description: 'ids of users in dialog', type: [Number] })
  userIds: number[];
}
