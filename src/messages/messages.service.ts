import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDialogDto, MessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) { }

  async getDialogs(id: number) {
    return await this.prisma.dialog.findMany({
      where: { users: { some: { id: id } } },
    });
  }

  async getDialogById(id: number) {
    return await this.prisma.dialog.findFirst({ where: { id: id }, include: { messages: true } });
  }

  async createDialog(id: number, dto: CreateDialogDto) {
    const ids = dto.userIds.map((uid) => {
      return { id: uid };
    });
    return await this.prisma.dialog.create({
      data: {
        users: {
          connect: [{ id: id }, ...ids],
        },
        messages: {
          create: [],
        },
      },
    });
  }

  async send(id: number, dto: MessageDto) {
    return await this.prisma.dialog.update({
      where: { id: dto.dialogId },
      data: { messages: { create: { from_id: id, text: dto.text } } },
    });
  }
}
