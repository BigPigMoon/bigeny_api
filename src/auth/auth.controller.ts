import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('local/singup')
    singupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singupLocal(dto);
    }

    @Post('local/singin')
    singinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.singinLocal(dto);
    }

    @Post('logout')
    logout() {
        return this.authService.logout();
    }

    @Post('refresh')
    refreshTokens() {
        return this.authService.refreshTokens();
    }
}
