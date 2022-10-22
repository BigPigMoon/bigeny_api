import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard,
  }],
  imports: [AuthModule, PrismaModule, UsersModule],
})
export class AppModule { }
