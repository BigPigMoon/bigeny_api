import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from './message.type';

export class DialogType {
  @ApiProperty({ description: 'id of dialog', example: '1' })
  id: number;

  @ApiProperty({
    description:
      'name of dialog (for only 2 dialog name equal like name of user)',
    example: 'cool dialog',
  })
  name: string;

  @ApiProperty({
    description: 'path to avatar of dialog',
    example: 'https://bigeny.ru/store/lkasdjflajksdf.png',
  })
  avatar: string;

  @ApiProperty({
    description: 'readed user(current user) this dialog or not',
    example: 'true',
  })
  isReaded: boolean;

  @ApiProperty({ description: 'count of user in this dialog', example: '12' })
  countOfUser: number;

  @ApiProperty({ description: 'last message of this dialog mb null' })
  lastMessage: MessageType | null;
}
