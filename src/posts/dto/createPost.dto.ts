import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({})
  content: string;

  @ApiProperty({})
  image: string | null;

  @ApiProperty({})
  channelId: number;
}
