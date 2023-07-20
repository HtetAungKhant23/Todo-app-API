import { IsNotEmpty, IsString } from "class-validator";

export class UserInvite {
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserConfirmDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserReqOtp {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
