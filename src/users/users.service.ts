import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { UserType } from './types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(self_id: number): Promise<UserType[]> {
    return await this.prisma.user.findMany({
      where: { NOT: { id: self_id } },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async getUserById(id: number): Promise<UserType> {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async updateAvatar(id: number, filename: string): Promise<UserType> {
    return await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
      select: { nickname: true, id: true, avatar: true, email: true },
    });
  }

  async updateDeviceToken(id: number, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: id },
      data: { deviceToken: token },
    });
  }

  async getAvatar(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user.avatar;
  }

  async updateNickname(id: number, dto: UpdateUserDto): Promise<UserType> {
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
        throw new BadRequestException('Nickname already in use');
      }
    } else {
      throw new BadRequestException('Nickname already in use');
    }
  }

  async getMe(id: number): Promise<UserType> {
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
