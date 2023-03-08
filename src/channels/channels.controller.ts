import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateChannelDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelType } from './types';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({ summary: 'Get all channel in subscribe' })
  @ApiResponse({ type: [ChannelType] })
  @Get('/subs')
  getSubsChannels(@GetCurrentUser('sub') uid: number): Promise<ChannelType[]> {
    return this.channelsService.getSubsChannels(uid);
  }

  @ApiOperation({ summary: 'Create channel' })
  @ApiResponse({ type: Boolean })
  @Post('/create')
  createChannel(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: CreateChannelDto,
  ): Promise<ChannelType> {
    return this.channelsService.createChannel(uid, dto);
  }

  @ApiOperation({ summary: 'Get channel by id' })
  @ApiResponse({ type: ChannelType })
  @Get('/:id')
  getChannelById(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) cid: number,
  ): Promise<ChannelType> {
    return this.channelsService.getChannelById(uid, cid);
  }

  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({ type: [ChannelType] })
  @Get('/')
  getChannels(@GetCurrentUser('sub') uid: number): Promise<ChannelType[]> {
    return this.channelsService.getChannels(uid);
  }

  @ApiOperation({ summary: 'Subscribe or unsubscribe to channel' })
  @ApiResponse({ type: ChannelType })
  @Post('/sub/:id')
  subUnsubOnChannel(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) cid: number,
  ): Promise<ChannelType> {
    return this.channelsService.subUnsubOnChannel(uid, cid);
  }
}
