import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto';
import { ChannelType } from './types';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    uid: number,
    dto: CreateChannelDto,
  ): Promise<ChannelType> {
    const channel = await this.prisma.channel.findUnique({
      where: { name: dto.name },
    });

    if (channel)
      throw new BadRequestException('The channel name already in use');

    const newChannel = await this.prisma.channel.create({
      data: {
        name: dto.name,
        avatar: dto.avatar,
        description: dto.description,
        owner: { connect: { id: uid } },
      },
      include: { owner: true },
    });

    return {
      id: newChannel.id,
      avatar: newChannel.avatar,
      description: newChannel.description,
      ownerId: newChannel.ownerId,
      name: newChannel.name,
      lastPost: null,
      subscribe: false,
    };
  }

  async getChannelById(uid: number, cid: number): Promise<ChannelType> {
    const ret = await this.prisma.channel.findUnique({
      where: { id: cid },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
      },
    });

    const sub =
      (await this.prisma.subsribe.findUnique({
        where: { channelId_userId: { channelId: cid, userId: uid } },
      })) !== null;

    return {
      id: ret.id,
      avatar: ret.avatar,
      description: ret.description,
      ownerId: ret.ownerId,
      name: ret.name,
      lastPost: ret.posts[0],
      subscribe: sub,
    };
  }

  async getChannels(uid: number): Promise<ChannelType[]> {
    const res = await this.prisma.channel.findMany({
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
        subribers: { where: { userId: uid } },
      },
    });

    return res.map((ret) => ({
      id: ret.id,
      avatar: ret.avatar,
      description: ret.description,
      ownerId: ret.ownerId,
      name: ret.name,
      lastPost: ret.posts[0],
      subscribe: ret.subribers.length > 0,
    }));
  }

  async getSubsChannels(uid: number): Promise<ChannelType[]> {
    const mines = await this.prisma.channel.findMany({
      where: { ownerId: uid },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
        subribers: { where: { userId: uid } },
      },
    });

    const mineRet = mines.map((val) => ({
      id: val.id,
      avatar: val.avatar,
      description: val.description,
      ownerId: val.ownerId,
      name: val.name,
      lastPost: val.posts[0],
      subscribe: val.subribers.length > 0,
    }));

    const subs = await this.prisma.channel.findMany({
      where: { subribers: { some: { userId: uid } } },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
        subribers: { where: { userId: uid } },
      },
    });

    const subsRet = subs.map((val) => ({
      id: val.id,
      avatar: val.avatar,
      description: val.description,
      ownerId: val.ownerId,
      name: val.name,
      lastPost: val.posts[0],
      subscribe: val.subribers.length > 0,
    }));

    return [...mineRet, ...subsRet];
  }

  async subUnsubOnChannel(uid: number, cid: number): Promise<ChannelType> {
    const { ownerId } = await this.prisma.channel.findUnique({
      where: { id: cid },
      select: { ownerId: true },
    });

    if (ownerId === uid) return null;

    const subribed = await this.prisma.subsribe.findUnique({
      where: { channelId_userId: { channelId: cid, userId: uid } },
    });

    if (subribed) {
      await this.prisma.subsribe.delete({
        where: {
          channelId_userId: { channelId: cid, userId: uid },
        },
      });
    } else {
      await this.prisma.subsribe.create({
        data: { userId: uid, channelId: cid },
        include: { channle: true, user: true },
      });
    }

    const ret = await this.prisma.channel.findUnique({
      where: { id: cid },
      include: { posts: true, subribers: true },
    });

    return {
      id: ret.id,
      avatar: ret.avatar,
      description: ret.description,
      ownerId: ret.ownerId,
      name: ret.name,
      lastPost: ret.posts[0],
      subscribe: !subribed,
    };
  }
}
