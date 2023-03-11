import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateDialogDto, MessageDto } from './dto';
import { MessagesService } from './messages.service';
import { DialogType, MessageType } from './types';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @ApiOperation({ summary: 'Get all dialogs from database' })
  @ApiResponse({ type: [DialogType] })
  @Get('/dialogs')
  getDialogs(@GetCurrentUser('sub') uid: number): Promise<DialogType[]> {
    return this.messageService.getDialogs(uid);
  }

  @ApiOperation({ summary: 'Create the dialog' })
  @ApiResponse({ type: DialogType })
  @Post('/createDialog')
  createDialog(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: CreateDialogDto,
  ): Promise<DialogType> {
    return this.messageService.createDialog(uid, dto);
  }

  @ApiOperation({ summary: 'Get dialog by id from database' })
  @ApiResponse({ type: DialogType })
  @Get('/dialogs/:id')
  getDialogById(
    @GetCurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) dialogId: number,
  ): Promise<DialogType> {
    return this.messageService.getDialogById(userId, dialogId);
  }

  @ApiOperation({ summary: 'Get all messages from dialog' })
  @ApiResponse({ type: [MessageType] })
  @Get('/:id')
  getMessages(
    @GetCurrentUser('sub') uid: number,
    @Param('id', ParseIntPipe) did: number,
  ): Promise<MessageType[]> {
    return this.messageService.getMessages(uid, did);
  }

  @ApiOperation({ summary: 'Send message' })
  @ApiResponse({ type: MessageType })
  @Post('/send')
  send(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: MessageDto,
  ): Promise<MessageType> {
    return this.messageService.send(uid, dto);
  }
}
