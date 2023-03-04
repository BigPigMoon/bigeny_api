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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostType, RateType } from './types';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Create the post' })
  @ApiResponse({ type: PostType })
  @Post('/create')
  createPost(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: CreatePostDto,
  ): Promise<PostType> {
    return this.postsService.createPost(uid, dto);
  }

  @ApiOperation({ summary: 'Get posts from subscribe channels' })
  @ApiResponse({ type: [PostType] })
  @Get('/subs')
  getPostFromSubscribesChannel(
    @GetCurrentUser('sub') uid: number,
  ): Promise<PostType[]> {
    return this.postsService.getPostFromSubscribesChannel(uid);
  }

  @ApiOperation({ summary: 'Get all posts from channel by id' })
  @ApiResponse({ type: [PostType] })
  @Get('/channel/:id')
  getPostsFromChannel(
    @Param('id', ParseIntPipe) cid: number,
  ): Promise<PostType[]> {
    return this.postsService.getPostsFromChannel(cid);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ type: [PostType] })
  @Get('/')
  getAllPosts(): Promise<PostType[]> {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: 'Get one post by id' })
  @ApiResponse({ type: PostType })
  @Get('/:id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostType> {
    return this.postsService.getPostById(id);
  }

  @ApiOperation({ summary: 'Set post rate by post id' })
  @ApiResponse({ type: Boolean })
  @Post('/rate/:id')
  setPostRate(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) pid: number,
  ): Promise<boolean> {
    return this.postsService.setPostRate(uid, pid);
  }

  @ApiOperation({ summary: 'Get post rate by post id' })
  @ApiResponse({ type: RateType })
  @Get('/rate/:id')
  getPostRate(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) pid: number,
  ): Promise<RateType> {
    return this.postsService.getPostRate(uid, pid);
  }

  // TODO: comment mb later
}
