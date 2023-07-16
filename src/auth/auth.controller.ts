import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserInvite } from "./dto/create-auth.dto";

@Controller("auth")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("user/register")
  async userRegister(@Body() registerData: UserInvite) {
    const newUser = await this.authService.invite(registerData);
    return newUser;
  }
}
