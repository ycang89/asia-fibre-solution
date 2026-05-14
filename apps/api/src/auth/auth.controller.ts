import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAccountDto } from './dto/login-account.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login/account')
  login(@Body() body: LoginAccountDto) {
    return this.auth.login(body);
  }

  @Post('login/outLogin')
  outLogin() {
    return { data: {}, success: true };
  }

  @Get('currentUser')
  currentUser(@Headers('authorization') authorization?: string) {
    return this.auth.getCurrentUser(authorization);
  }
}
