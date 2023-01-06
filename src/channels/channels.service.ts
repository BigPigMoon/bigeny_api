import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(uid: number, dto: CreateChannelDto) {
    return await this.prisma.channel.create({
      data: {
        name: dto.name,
        avatar: dto.avatar,
        description: dto.description,
        owner: { connect: { id: uid } },
      },
      include: { owner: true },
    });
  }

  async getChannelById(id: number) {
    return await this.prisma.channel.findUnique({
      where: { id: id },
      include: { owner: true, posts: true },
    });
  }

  async getChannels() {
    return await this.prisma.channel.findMany({
      include: { posts: true, owner: true },
    });
  }

  async getSubsChannels(uid: number) {
    return await this.prisma.channel.findMany({
      where: { subribers: { some: { userId: uid } } },
      include: { subribers: true, posts: true, owner: true },
    });
  }

  async subscribeOnChannel(uid: number, cid: number): Promise<boolean> {
    const { ownerId } = await this.prisma.channel.findUnique({
      where: { id: cid },
      select: { ownerId: true },
    });

    if (ownerId === uid) return false;

    const subribed = await this.prisma.subsribe.findUnique({
      where: { channelId_userId: { channelId: cid, userId: uid } },
    });
    if (subribed) return false;

    await this.prisma.subsribe.create({
      data: { userId: uid, channelId: cid },
      include: { channle: true, user: true },
    });

    return true;
  }
}
