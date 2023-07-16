import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserInvite } from "./dto/create-auth.dto";

@Controller("auth/user")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async userRegister(@Body() registerData: UserInvite) {
    const newUser = await this.authService.invite(registerData);
    return newUser;
  }

  // @Post('login')
  // async userLogin(@Body() loginData: )
}
