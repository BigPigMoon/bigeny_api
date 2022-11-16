import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(self_id: number) {
    return await this.prisma.user.findMany({
      where: { NOT: { id: self_id } },
      select: { nickname: true, id: true },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: { nickname: true },
    });
  }
}
