import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('local/singup')
    @HttpCode(HttpStatus.CREATED)
    singupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singupLocal(dto);
    }

    @Post('local/singin')
    @HttpCode(HttpStatus.OK)
    singinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singinLocal(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout() {
        // return this.authService.logout();
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens() {
        // return this.authService.refreshTokens();
    }
}
