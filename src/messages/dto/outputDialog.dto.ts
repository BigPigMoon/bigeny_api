import { Message } from '@prisma/client';

export class OutputDialogDto {
  id: number;
  name: string;
  messages: Message[];
  avatar: string;
  isReaded: boolean;

  constructor(
    id: number,
    name: string,
    messages: Message[],
    avatar: string,
    isReaded: boolean,
  ) {
    id = id;
    name = name;
    messages = messages;
    avatar = avatar;
    isReaded = isReaded;
  }
}
