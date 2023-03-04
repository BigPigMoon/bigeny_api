import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { SinginDto, SingupDto } from './dto';
import { Tokens } from './types';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Singup in local way' })
  @ApiResponse({ type: Tokens })
  @Public()
  @Post('local/singup')
  @HttpCode(HttpStatus.CREATED)
  singupLocal(@Body() dto: SingupDto): Promise<Tokens> {
    return this.authService.singupLocal(dto);
  }

  @ApiOperation({ summary: 'singin in local way' })
  @ApiResponse({ type: Tokens })
  @Public()
  @Post('local/singin')
  @HttpCode(HttpStatus.OK)
  singinLocal(@Body() dto: SinginDto): Promise<Tokens> {
    return this.authService.singinLocal(dto);
  }

  @ApiOperation({
    summary: 'logout from user and remove refresh token from database',
  })
  @ApiResponse({ type: null })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'update refresh token in database' })
  @ApiResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('refreshToken') rt: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, rt);
  }
}
