import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserAuthGuard } from "src/auth/auth.guard";
import { ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("User")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }
}
