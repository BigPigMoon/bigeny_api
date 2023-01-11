import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetCurrentUser } from 'src/common/decorators';
import { CreatePostDto } from './dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/create')
  createPost(@GetCurrentUser('sub') uid: number, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(uid, dto);
  }

  @Get('/subs')
  getPostFromSubscribesChannel(@GetCurrentUser('sub') uid: number) {
    return this.postsService.getPostFromSubscribesChannel(uid);
  }

  @Get('/channel/:id')
  getPostsFromChannel(@Param('id', ParseIntPipe) cid: number) {
    return this.postsService.getPostsFromChannel(cid);
  }

  @Get('/')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('/:id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post('/rate/:id')
  setPostRate(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) pid: number,
    @Body() dto: { positive: boolean },
  ): Promise<boolean> {
    return this.postsService.setPostRate(uid, pid, dto.positive);
  }

  @Get('/rate/:id')
  getPostRate(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) pid: number,
  ): Promise<{ rate: number; userRate: number }> {
    return this.postsService.getPostRate(uid, pid);
  }

  // TODO: comment mb later
}
