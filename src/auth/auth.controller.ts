import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserConfirmDto, UserInvite, UserLoginDto } from "./dto/create-auth.dto";

@Controller("auth/user")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async userRegister(@Body() registerData: UserInvite) {
    return this.authService.invite(registerData);
  }

  @Post("confirm")
  async userConfirm(@Body() confirmData: UserConfirmDto) {
    return this.authService.confirmUser(confirmData);
  }

  @Post("login")
  async userLogin(@Body() loginData: UserLoginDto) {
    return this.authService.loginUser(loginData);
  }
}
