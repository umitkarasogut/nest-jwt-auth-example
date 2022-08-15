import { Body, Controller, Get, Post, UseGuards, Request, Response, UnauthorizedException, HttpStatus } from '@nestjs/common';
import CreateUserDto from 'src/user/dto/create.user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    me(@Request() request) {
        return request.user;
    }

    @Post('/login')
    async login(@Body() dto: LoginDto, @Response() res) {
        const { password, email } = dto
        const token = await this.authService.login(email, password)
        
        if (!token) throw new UnauthorizedException();

        res.cookie('access_token', token, {
            expires: new Date(new Date().getTime() + 30 * 1000),
            httpOnly: true,
        });

        return res.send({
            status: true,
            data: { token }
        })
    }

    @Post('/register')
    async register(@Body() dto: CreateUserDto) {
        try {
            return await this.authService.register(dto);
        } catch (e) {
            return {
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: e.message
            }
        }
    }
}
