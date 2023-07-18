import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserAuthGuard } from "src/auth/auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("User")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get User List" })
  @ApiBearerAuth()
  @Get()
  @UseGuards(UserAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }
}
