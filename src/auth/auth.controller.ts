import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { GetCurrentUser, Public } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('local/singup')
    @HttpCode(HttpStatus.CREATED)
    singupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singupLocal(dto);
    }

    @Public()
    @Post('local/singin')
    @HttpCode(HttpStatus.OK)
    singinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singinLocal(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser('sub') userId: number) {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUser('sub') userId: number, @GetCurrentUser('refreshToken') rt: string) {
        return this.authService.refreshTokens(userId, rt);
    }
}
