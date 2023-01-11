import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(uid: number, dto: CreatePostDto) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
      include: { owner: true },
    });

    if (channel.ownerId !== uid) {
      return;
    }

    return await this.prisma.post.create({
      data: {
        content: dto.content,
        image: dto.image,
        channel: { connect: { id: dto.channelId } },
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        image: true,
        channelId: true,
      },
    });
  }

  async getPostsFromChannel(cid: number) {
    return await this.prisma.post.findMany({
      where: { channel: { id: cid } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        image: true,
        channelId: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPosts() {
    return await this.prisma.post.findMany({
      select: {
        id: true,
        createdAt: true,
        content: true,
        image: true,
        channelId: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id: id },
      select: {
        id: true,
        createdAt: true,
        content: true,
        image: true,
        channelId: true,
      },
    });
  }

  async getPostFromSubscribesChannel(uid: number) {
    // TODO: and mine posts also

    const channelIds: number[] = (
      await this.prisma.subsribe.findMany({
        where: { user: { id: uid } },
        select: { channelId: true },
      })
    ).map((val) => {
      return val.channelId;
    });

    return await this.prisma.post.findMany({
      where: { channel: { id: { in: channelIds } } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        image: true,
        channelId: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setPostRate(
    uid: number,
    pid: number,
    positive: boolean,
  ): Promise<boolean> {
    const rate = await this.prisma.rate.findUnique({
      where: { userId_postId: { postId: pid, userId: uid } },
    });

    if (rate) {
      if (rate.positive === positive) {
        await this.prisma.rate.delete({
          where: { userId_postId: { userId: uid, postId: pid } },
        });
      } else {
        await this.prisma.rate.update({
          where: { userId_postId: { postId: pid, userId: uid } },
          data: { positive: positive },
        });
      }
      return true;
    }

    const post = await this.prisma.post.findUnique({ where: { id: pid } });
    const user = await this.prisma.user.findUnique({ where: { id: uid } });

    if (!post || !user) return false;

    const newRate = await this.prisma.rate.create({
      data: {
        post: { connect: { id: pid } },
        user: { connect: { id: uid } },
        positive: positive,
      },
      include: { post: true, user: true },
    });
    if (newRate) return true;
    return false;
  }

  async getPostRate(
    uid: number,
    pid: number,
  ): Promise<{ rate: number; userRate: number }> {
    const postRate = await this.prisma.rate.findMany({
      where: { postId: pid },
      select: { positive: true, userId: true },
    });

    let rate = 0;
    let userRate = 0;

    postRate.forEach((element: { positive: boolean; userId: number }) => {
      if (element.positive) {
        if (element.userId === uid) userRate++;
        rate++;
      } else {
        if (element.userId === uid) userRate--;
        rate--;
      }
    });

    return { rate: rate, userRate: userRate };
  }
}
