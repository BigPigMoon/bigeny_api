import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';
import { PostType, RateType } from './types';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(uid: number, dto: CreatePostDto): Promise<PostType> {
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

  async getPostsFromChannel(cid: number): Promise<PostType[]> {
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

  async getAllPosts(): Promise<PostType[]> {
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

  async getPostById(id: number): Promise<PostType> {
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

  async getPostFromSubscribesChannel(uid: number): Promise<PostType[]> {
    const channelIds: number[] = (
      await this.prisma.subsribe.findMany({
        where: { user: { id: uid } },
        select: { channelId: true },
      })
    ).map((val) => {
      return val.channelId;
    });

    channelIds.push(
      ...(
        await this.prisma.channel.findMany({
          where: { owner: { id: uid } },
          select: { id: true },
        })
      ).map((val) => {
        return val.id;
      }),
    );

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

  async setPostRate(uid: number, pid: number): Promise<boolean> {
    const rate = await this.prisma.rate.findUnique({
      where: { userId_postId: { postId: pid, userId: uid } },
      include: { user: true, post: true },
    });

    if (rate) {
      await this.prisma.rate.delete({
        where: { userId_postId: { userId: uid, postId: pid } },
      });

      return true;
    } else {
      const newRate = await this.prisma.rate.create({
        data: {
          post: { connect: { id: pid } },
          user: { connect: { id: uid } },
        },
        include: { post: true, user: true },
      });

      if (newRate) return true;
    }

    return false;
  }

  async getPostRate(uid: number, pid: number): Promise<RateType> {
    const postRates = await this.prisma.rate.findMany({
      where: { postId: pid },
      select: { userId: true },
    });

    const rate = postRates.length;
    const userRate = postRates.includes({ userId: uid });

    return { rate: rate, userRate: userRate };
  }
}
