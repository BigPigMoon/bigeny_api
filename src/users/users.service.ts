import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(self_id: number) {
    return await this.prisma.user.findMany({
      where: { NOT: { id: self_id } },
      select: { nickname: true, id: true, avatarImg: true },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: { nickname: true, avatarImg: true, id: true },
    });
  }

  async uploadAvatar(id: number, file: Express.Multer.File) {
    return await this.prisma.user.update({
      where: { id: id },
      data: { avatarImg: file.filename },
    });
  }

  async getAvatar(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user.avatarImg;
  }

  async updateNickname(id: number, body: UpdateUserDto) {
    if (body.nickname.length != 0) {
      return this.prisma.user.update({where: {id: id}, data: {nickname: body.nickname}});
    }
  }

  async getMe(id: number) {
    return await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        nickname: true,
        avatarImg: true,
        id: true,
        email: true,
      },
    });
  }
}
