import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { StoreController } from './store/store.controller';
import { StoreModule } from './store/store.module';
import { FcmModule } from 'nestjs-fcm';
import { join } from 'path';
import { ChannelsModule } from './channels/channels.module';
import { PostsModule } from './posts/posts.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    MessagesModule,
    StoreModule,
    FcmModule.forRoot({
      firebaseSpecsPath: join(__dirname, '../firebase.spec.json'),
    }),
    ChannelsModule,
    PostsModule,
  ],
  controllers: [StoreController],
})
export class AppModule {}
