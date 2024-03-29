import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserOutput } from './types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(self_id: number): Promise<UserOutput[]> {
    return await this.prisma.user.findMany({
      where: { NOT: { id: self_id } },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async getUserById(id: number): Promise<UserOutput> {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async updateAvatar(id: number, filename: string): Promise<UserOutput> {
    return await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async updateDeviceToken(id: number, token: string) {
    await this.prisma.user.update({
      where: { id: id },
      data: { deviceToken: token },
    });
  }

  async getAvatar(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user.avatar;
  }

  async updateNickname(id: number, dto: UpdateUserDto): Promise<UserOutput> {
    if (dto.nickname.length != 0) {
      const otherUser = await this.prisma.user.findUnique({
        where: { nickname: dto.nickname },
      });
      if (otherUser == null) {
        return await this.prisma.user.update({
          where: { id: id },
          data: { nickname: dto.nickname },
          select: { nickname: true, id: true, avatar: true, email: true },
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getMe(id: number): Promise<UserOutput> {
    return await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        nickname: true,
        avatar: true,
        id: true,
        email: true,
      },
    });
  }
}
