import { Injectable } from '@nestjs/common';
import { Dialog, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDialogDto, MessageDto } from './dto';
import { randomUUID } from 'crypto';
import { FcmService } from 'nestjs-fcm';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly fcmService: FcmService,
  ) {}

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
            count: element.users.length,
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
    let member = false;
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
      count: dialog.users.length,
    };
  }

  async getMessages(userId: number, dialogId: number) {
    const ret = await this.prisma.message.findMany({
      where: { dialogId: dialogId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, content: true, createdAt: true, ownerId: true },
    });

    if (ret.length > 0) {
      await this.prisma.readStatus.update({
        where: { dialogId_userId: { userId: userId, dialogId: dialogId } },
        data: { readed: true },
      });
    }

    return ret;
  }

  async createDialog(self_id: number, dto: CreateDialogDto): Promise<boolean> {
    const dialog = await this.prisma.dialog.findUnique({
      where: { name: dto.name },
    });
    if (dialog != null) {
      return false;
    }

    const users: { id: number }[] = dto.users.map((e: number) => {
      return { id: e };
    });
    users.push({ id: self_id });
    let name = dto.name;
    if (users.length == 2) {
      const dialogs1 = await this.prisma.dialog.findMany({
        where: { users: { some: { id: users[0].id } } },
        include: { users: true },
      });

      for (let index = 0; index < dialogs1.length; index++) {
        const elem = dialogs1[index];

        if (elem.users.length == 2) {
          const usersInElem = elem.users.map((e) => {
            return e.id;
          });
          if (usersInElem.includes(users[0].id)) {
            return false;
          }
        }
      }

      name = randomUUID();
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

    const usersReaded: { dialogId: number; userId: number }[] = dto.users.map(
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

    if (message == null) return false;

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

    const { nickname } = await this.prisma.user.findUnique({
      where: { id: id },
      select: { nickname: true },
    });

    const asdf = dialog.users
      .map((user: User) => {
        if (user.id != id) {
          return user.deviceToken;
        }
        return undefined;
      })
      .filter((user) => {
        return user !== undefined;
      })
      .filter((user) => {
        return user !== null;
      });

    try {
      if (asdf.length != 0) {
        this.fcmService.sendNotification(
          dialog.users
            .map((user: User) => {
              if (user.id != id) {
                return user.deviceToken;
              }
            })
            .filter((user) => {
              return user !== undefined;
            }),
          {
            notification: { title: `${nickname}`, body: `${dto.content}` },
            data: { dialogId: dialog.id.toString() },
          },
          false,
        );
      }
    } catch (e) {
      console.log(e);
    }

    return true;
  }
}
