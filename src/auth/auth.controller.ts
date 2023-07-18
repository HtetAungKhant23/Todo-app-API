import { Controller, Post, Body, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserConfirmDto, UserInvite, UserLoginDto, UserReqOtp } from "./dto/user-auth.dto";
import { IAuthRequest } from "src/@types/authRequest";
import { UserAuthGuard } from "./auth.guard";
import { Request as expRequest } from "express";
import { ApiTags } from "@nestjs/swagger";

@Controller("auth/user")
@ApiTags("Auth")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async userRegister(@Body() registerData: UserInvite): Promise<any> {
    return this.authService.invite(registerData);
  }

  @Post("confirm")
  async userConfirm(@Body() confirmData: UserConfirmDto): Promise<any> {
    return this.authService.confirmUser(confirmData);
  }

  @Post("login")
  async userLogin(@Body() loginData: UserLoginDto): Promise<any> {
    return this.authService.loginUser(loginData);
  }

  @Get("me")
  @UseGuards(UserAuthGuard)
  async userValidateMe(@Request() req: IAuthRequest): Promise<any> {
    console.log(req.user.id);
    return this.authService.validateMe({ id: req.user.id });
  }

  @Post("request-otp")
  async userRequestOtp(@Body() reqOtpDto: UserReqOtp): Promise<any> {
    return this.authService.requestOtp(reqOtpDto);
  }

  @Get("refresh-token")
  async userRefreshToken(@Request() req: expRequest): Promise<any> {
    return this.authService.requestRefreshToken(req);
  }
}
