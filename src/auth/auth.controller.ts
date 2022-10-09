import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('/')
    auth() {
        return 'Hello auth';
    }
    @Post('/local/singup')
    singup_local(@Body() dto: AuthDto): Promise<Tokens> {
        this.authService.singup_local(dto);
    }

    @Post('/local/singin')
    singin_local() {
        this.authService.singin_local();
    }

    @Post('/logout')
    logout() {
        this.authService.logout();
    }

    @Post('/refresh')
    refreshTokens() {
        this.authService.refreshTokens();
    }
}
