import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
  }

  @Post('/register')
  async register(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
  }

  @Get('test')
  @UseGuards(AuthGuard)
  async test() {
    return 'test';
  }
}
