import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto';
import { ChannelType } from './types';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(uid: number, dto: CreateChannelDto): Promise<boolean> {
    const channel = await this.prisma.channel.findUnique({
      where: { name: dto.name },
    });

    if (channel) return false;

    await this.prisma.channel.create({
      data: {
        name: dto.name,
        avatar: dto.avatar,
        description: dto.description,
        owner: { connect: { id: uid } },
      },
      include: { owner: true },
    });
    return true;
  }

  async getChannelById(id: number): Promise<ChannelType> {
    return await this.prisma.channel.findUnique({
      where: { id: id },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getChannels(): Promise<ChannelType[]> {
    return await this.prisma.channel.findMany({
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getSubsChannels(uid: number): Promise<ChannelType[]> {
    const mine = await this.prisma.channel.findMany({
      where: { ownerId: uid },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
      },
    });

    const subs = await this.prisma.channel.findMany({
      where: { subribers: { some: { userId: uid } } },
      select: {
        id: true,
        avatar: true,
        description: true,
        ownerId: true,
        name: true,
        posts: { orderBy: { createdAt: 'desc' } },
      },
    });

    return [...mine, ...subs];
  }

  async subUnsubOnChannel(uid: number, cid: number): Promise<boolean> {
    const { ownerId } = await this.prisma.channel.findUnique({
      where: { id: cid },
      select: { ownerId: true },
    });

    if (ownerId === uid) return false;

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

    return true;
  }
}
