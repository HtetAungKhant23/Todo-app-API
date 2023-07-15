import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInvite } from './dto/create-auth.dto';
import { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  async userRegister(@Body() registerData: UserInvite, @Res res: Response) {
    const newUser = await this.authService.invite(registerData);
    return newUser;
  }

}
