import { Injectable } from '@nestjs/common';
import { Dialog, Message, User } from '@prisma/client';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDialogDto, MessageDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getDialogs(id: number) {
    const dialogs: (Dialog & { users: User[]; message: Message[] })[] =
      await this.prisma.dialog.findMany({
        where: { users: { some: { id: id } } },
        include: { message: true, users: true },
      });
    const ret = await Promise.all(
      dialogs.map(
        async (element: Dialog & { users: User[]; message: Message[] }) => {
          const readed = await this.prisma.readStatus.findFirst({
            where: { dialogId: element.id, userId: id },
            select: { readed: true },
          });
          let name = element.name;
          let avatar = element.avatar;
          if (element.users.length == 2) {
            if (element.users[0].id == id) {
              name = element.users[1].nickname;
              avatar = element.users[1].avatar;
            }
            if (element.users[1].id == id) {
              name = element.users[0].nickname;
              avatar = element.users[0].avatar;
            }
          }
          return {
            id: element.id,
            name: name,
            messages: element.message
              .map((message: Message) => {
                return {
                  id: message.id,
                  content: message.content,
                  createAt: message.createdAt,
                };
              })
              .sort((a, b) => b.createAt.valueOf() - a.createAt.valueOf()),
            avatar: avatar,
            isReaded: readed.readed,
          };
        },
      ),
    );
    return ret;
  }

  async getDialogById(userId: number, dialogId: number) {
    const dialog = await this.prisma.dialog.findUnique({
      where: { id: dialogId },
      include: { users: true, message: true },
    });
    if (dialog == null) return null;
    let member: boolean = false;
    for (let i = 0; i < dialog.users.length; i++) {
      if (dialog.users[i].id === userId) {
        member = true;
      }
    }
    if (!member) return null;
    let name = dialog.name;
    let avatar = dialog.avatar;
    if (dialog.users.length == 2) {
      if (dialog.users[0].id == userId) {
        name = dialog.users[1].nickname;
        avatar = dialog.users[1].avatar;
      }
      if (dialog.users[1].id == userId) {
        name = dialog.users[0].nickname;
        avatar = dialog.users[0].avatar;
      }
    }
    return {
      id: dialog.id,
      name: name,
      avatar: avatar,
    };
  }

  async getMessages(userid: number, dialogId: number) {
    const ret = await this.prisma.message.findMany({
      where: { dialogId: dialogId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, content: true, createdAt: true, ownerId: true },
    });
    await this.prisma.readStatus.update({
      where: { dialogId_userId: { userId: userid, dialogId: dialogId } },
      data: { readed: true },
    });

    return ret;
  }

  async createDialog(self_id: number, dto: CreateDialogDto): Promise<boolean> {
    const dialog = await this.prisma.dialog.findUnique({
      where: { name: dto.name },
    });
    if (dialog != null) {
      return false;
    }

    let users: { id: number }[] = dto.users.map((e: number) => {
      return { id: e };
    });
    users.push({ id: self_id });
    let name = dto.name;
    if (users.length == 2) {
      const dialogs1 = await this.prisma.dialog.findMany({
        where: { users: { some: { id: users[0].id } } },
      });

      const dialogs2 = await this.prisma.dialog.findMany({
        where: { users: { some: { id: users[1].id } } },
      });

      for (let i = 0; i < dialogs1.length; i++) {
        for (let j = 0; j < dialogs2.length; j++) {
          if (dialogs2[j].name == dialogs1[i].name) {
            return false;
          }
        }
      }
      name = uuidv4();
    }

    const res = await this.prisma.dialog.create({
      data: {
        name: name,
        avatar: dto.avatar,
        users: {
          connect: users,
        },
      },
      include: { users: true },
    });

    let usersReaded: { dialogId: number; userId: number }[] = dto.users.map(
      (e: number) => {
        return { dialogId: res.id, userId: e };
      },
    );
    usersReaded.push({ dialogId: res.id, userId: self_id });

    await this.prisma.readStatus.createMany({ data: usersReaded });
    return true;
  }

  async send(id: number, dto: MessageDto): Promise<boolean> {
    const dialog = await this.prisma.dialog.findUnique({
      where: { id: dto.dialogId },
      include: { users: true },
    });
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        owner: { connect: { id: id } },
        dialog: { connect: { id: dto.dialogId } },
      },
      include: { owner: true, dialog: true },
    });

    for (let i = 0; i < dialog.users.length; i++) {
      if (dialog.users[i].id === id) continue;
      await this.prisma.readStatus.update({
        where: {
          dialogId_userId: {
            dialogId: dto.dialogId,
            userId: dialog.users[i].id,
          },
        },
        data: {
          readed: false,
        },
      });
    }

    if (message == null) return false;
    return true;
  }
}
