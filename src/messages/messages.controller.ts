import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateDialogDto, MessageDto } from './dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) { }

  @ApiOperation({ summary: 'Get all dialogs from database' })
  @Get('/dialogs')
  getDialogs(@GetCurrentUser('sub') id: number) {
    return this.messageService.getDialogs(id);
  }

  @ApiOperation({ summary: 'Create the dialog' })
  @Post('/createDialog')
  createDialog(
    @GetCurrentUser('sub') uid: number,
    @Body() dto: CreateDialogDto,
  ) {
    return this.messageService.createDialog(uid, dto);
  }

  @ApiOperation({ summary: 'Get all dialog by id from database' })
  @Get('/dialogs/:id')
  getDialogById(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.getDialogById(id);
  }

  @ApiOperation({ summary: 'Send message' })
  @Post('/send')
  send(@GetCurrentUser('sub') id: number, @Body() dto: MessageDto) {
    return this.messageService.send(id, dto);
  }
}
