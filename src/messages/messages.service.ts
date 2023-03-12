import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDialogDto, MessageDto } from './dto';
import { randomUUID } from 'crypto';
import { FcmService } from 'nestjs-fcm';
import { DialogType, MessageType } from './types';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly fcmService: FcmService,
  ) {}

  async getDialogs(uid: number): Promise<DialogType[]> {
    const dialogs = await this.prisma.dialog.findMany({
      where: { users: { some: { id: uid } } },
      include: { message: { include: { owner: true } }, users: true },
    });
    const ret = await Promise.all(
      dialogs.map(async (element): Promise<DialogType> => {
        const readed = await this.prisma.readStatus.findFirst({
          where: { dialogId: element.id, userId: uid },
          select: { readed: true },
        });
        let name = element.name;
        let avatar = element.avatar;
        if (element.users.length == 2) {
          if (element.users[0].id == uid) {
            name = element.users[1].nickname;
            avatar = element.users[1].avatar;
          }
          if (element.users[1].id == uid) {
            name = element.users[0].nickname;
            avatar = element.users[0].avatar;
          }
        }

        const messages: MessageType[] = element.message
          .map((message): MessageType => {
            return {
              id: message.id,
              content: message.content,
              createdAt: message.createdAt,
              ownerId: message.owner.id,
              name: message.owner.nickname,
              avatar: message.owner.avatar,
            };
          })
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

        return {
          id: element.id,
          name: name,
          lastMessage: messages.length > 0 ? messages[0] : null,
          avatar: avatar,
          isReaded: readed.readed,
          countOfUser: element.users.length,
        };
      }),
    );

    return ret;
  }

  async getDialogById(uid: number, did: number): Promise<DialogType> {
    const dialog = await this.prisma.dialog.findUnique({
      where: { id: did },
      include: {
        users: true,
        message: { include: { owner: true } },
      },
    });

    if (dialog == null) return null;

    let member = false;
    for (let i = 0; i < dialog.users.length; i++) {
      if (dialog.users[i].id === uid) {
        member = true;
      }
    }

    if (!member) return null;

    let name = dialog.name;
    let avatar = dialog.avatar;

    if (dialog.users.length == 2) {
      if (dialog.users[0].id == uid) {
        name = dialog.users[1].nickname;
        avatar = dialog.users[1].avatar;
      }
      if (dialog.users[1].id == uid) {
        name = dialog.users[0].nickname;
        avatar = dialog.users[0].avatar;
      }
    }

    const readed = await this.prisma.readStatus.findFirst({
      where: { dialogId: dialog.id, userId: uid },
      select: { readed: true },
    });

    const messages: MessageType[] = dialog.message
      .map((message): MessageType => {
        return {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          ownerId: message.owner.id,
          name: message.owner.nickname,
          avatar: message.owner.avatar,
        };
      })
      .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

    return {
      id: dialog.id,
      name: name,
      avatar: avatar,
      countOfUser: dialog.users.length,
      isReaded: readed.readed,
      lastMessage: messages.length > 0 ? messages[0] : null,
    };
  }

  // async readDialog(uid: number, did: number): Promise<DialogType> {
  //   const readed = await this.prisma.readStatus.update({
  //     where: { dialogId_userId: { userId: uid, dialogId: did } },
  //     data: { readed: true },
  //   });

  //   const dialog = await this.prisma.dialog.findUnique({
  //     where: { id: did },
  //     include: {
  //       users: true,
  //       readStatus: true,
  //       message: { include: { owner: true } },
  //     },
  //   });

  //   const messages: MessageType[] = dialog.message
  //     .map((message): MessageType => {
  //       return {
  //         id: message.id,
  //         content: message.content,
  //         createdAt: message.createdAt,
  //         ownerId: message.owner.id,
  //         name: message.owner.nickname,
  //         avatar: message.owner.avatar,
  //       };
  //     })
  //     .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

  //   return {
  //     id: dialog.id,
  //     name: dialog.name,
  //     avatar: dialog.avatar,
  //     countOfUser: dialog.users.length,
  //     isReaded: readed.readed,
  //     lastMessage: messages.length > 0 ? messages[0] : null,
  //   };
  // }

  async getMessages(uid: number, did: number): Promise<MessageType[]> {
    const ret = await this.prisma.message.findMany({
      where: { dialogId: did },
      orderBy: { createdAt: 'asc' },
      select: { id: true, content: true, createdAt: true, owner: true },
    });

    if (ret.length > 0) {
      await this.prisma.readStatus.update({
        where: { dialogId_userId: { userId: uid, dialogId: did } },
        data: { readed: true },
      });
    }

    return ret.map((val) => ({
      id: val.id,
      content: val.content,
      createdAt: val.createdAt,
      ownerId: val.owner.id,
      name: val.owner.nickname,
      avatar: val.owner.avatar,
    }));
  }

  async createDialog(uid: number, dto: CreateDialogDto): Promise<DialogType> {
    const dialog = await this.prisma.dialog.findUnique({
      where: { name: dto.name },
    });
    if (dialog != null) {
      throw new BadRequestException('Dialog name already in use');
    }

    const users: { id: number }[] = dto.users.map((e: number) => {
      return { id: e };
    });
    users.push({ id: uid });
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
          if (usersInElem.includes(users[1].id)) {
            throw new BadRequestException('Dialog already created');
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

    if (res === null) throw new BadRequestException('Dialog did not create');

    const usersReaded: { dialogId: number; userId: number }[] = dto.users.map(
      (e: number) => {
        return { dialogId: res.id, userId: e };
      },
    );
    usersReaded.push({ dialogId: res.id, userId: uid });

    await this.prisma.readStatus.createMany({ data: usersReaded });
    return {
      id: res.id,
      name: res.name,
      avatar: res.avatar,
      countOfUser: res.users.length,
      isReaded: false,
      lastMessage: null,
    };
  }

  async send(id: number, dto: MessageDto): Promise<MessageType> {
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

    if (message == null) return null;

    // update readed
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
      // console.log(e);
    }

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      ownerId: message.owner.id,
      name: message.owner.nickname,
      avatar: message.owner.avatar,
    };
  }
}
