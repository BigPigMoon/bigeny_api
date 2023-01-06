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

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get('/subs')
  getSubsChannels(@GetCurrentUser('sub') uid: number) {
    console.log(uid);
    return this.channelsService.getSubsChannels(uid);
  }

  @Post('/create')
  createChannel(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: CreateChannelDto,
  ) {
    return this.channelsService.createChannel(uid, dto);
  }

  @Get('/:id')
  getChannelById(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.getChannelById(id);
  }

  @Get('/')
  getChannels() {
    return this.channelsService.getChannels();
  }

  @Post('/sub/:id')
  subscribeOnChannel(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) cid: number,
  ): Promise<boolean> {
    return this.channelsService.subscribeOnChannel(uid, cid);
  }
}
