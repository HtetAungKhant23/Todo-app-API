import { Controller, Post, Body, Get, Request, UseGuards, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserConfirmDto, UserInvite, UserLoginDto, UserProfileUpdateDTO, UserReqOtp, refreshTokenDto } from "./dto/user-auth.dto";
import { IAuthRequest } from "src/@types/authRequest";
import { UserAuthGuard } from "./auth.guard";
import { Request as expRequest } from "express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { fileStorage } from "src/helper/file-storage";
import { FileSizeValidationPipe } from "src/lib/fileInterceptor";

@Controller("auth/user")
@ApiTags("Auth")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "User Register" })
  @Post("register")
  async userRegister(@Body() registerData: UserInvite): Promise<any> {
    return this.authService.invite(registerData);
  }

  @ApiOperation({ summary: "User update profile" })
  @Post("update-profile")
  @ApiBody({
    description: "Update Profile",
    type: UserProfileUpdateDTO,
  })
  @ApiConsumes("multipart/form-data")
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor("image", 6, fileStorage))
  async updateProfile(@UploadedFiles(new FileSizeValidationPipe()) files: Array<Express.Multer.File>, @Request() req: IAuthRequest) {
    console.log("hay yo", files, req.user.id);
    return this.authService.profile(req, files);
  }

  @ApiOperation({ summary: "User Confirm" })
  @Post("confirm")
  async userConfirm(@Body() confirmData: UserConfirmDto): Promise<any> {
    return this.authService.confirmUser(confirmData);
  }

  @ApiOperation({ summary: "User Login" })
  @Post("login")
  async userLogin(@Body() loginData: UserLoginDto): Promise<any> {
    return this.authService.loginUser(loginData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "User Validate Me" })
  @Get("me")
  @UseGuards(UserAuthGuard)
  async userValidateMe(@Request() req: IAuthRequest): Promise<any> {
    console.log(req.user.id);
    return this.authService.validateMe({ id: req.user.id });
  }

  @ApiOperation({ summary: "User Request OTP" })
  @Post("request-otp")
  async userRequestOtp(@Body() reqOtpDto: UserReqOtp): Promise<any> {
    return this.authService.requestOtp(reqOtpDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "User Request Refresh Token" })
  @Post("refresh-token")
  @ApiBody({
    description: "Refresh Token",
    type: refreshTokenDto,
  })
  @UseGuards(UserAuthGuard)
  async userRefreshToken(@Body() refreshToken: string): Promise<any> {
    return this.authService.requestRefreshToken(refreshToken);
  }
}
