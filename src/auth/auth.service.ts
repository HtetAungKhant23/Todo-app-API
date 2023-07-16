import { Injectable, HttpException } from "@nestjs/common";
import { UserConfirmDto, UserInvite } from "./dto/create-auth.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";
import { hash } from "argon2";


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private async createUserHandler(data: UserInvite) {
    try {
      const code: number = Math.floor(100000 + Math.random() * 900000);
      const newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          phone: data.phone,
          otp: code.toString(),
          otpUsed: "UNUSED",
        },
      });

      return responser({
        statusCode: 200,
        message: "User invited successfully.",
        body: {
          user: {
            id: newUser.id,
            name: newUser.name,
          },
          otp: code,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "Internal server error occure!",
          devMessage: err,
        },
        500,
      );
    }
  }

  async invite(data: UserInvite) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (userExist) {
      throw new HttpException(
        {
          message: "Phone number is already exist!",
          devMessage: "phone-number-already-exist!",
        },
        500,
      );
    }

    return this.createUserHandler(data);
  }

  async confirmUser(data: UserConfirmDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: data.phone,
        otpUsed: "UNUSED",
      },
    });

    if (!user) {
      throw new HttpException(
        {
          message: "User not found",
          devMessage: "user-not-exist",
        },
        404,
      );
    }

    if (user.otp === data.code) {
      const updatedUser = await this.prisma.user.update({
        data: {
          otpUsed: "USED",
          password: await hash(data.password),
        },
        where: {
          id: user.id,
        },
      });

      return responser({
        statusCode: 200,
        message: "User invited successfully.",
        body: updatedUser,
      });

    } else {
      throw new HttpException(
        {
          message: "Otp not match",
          devMessage: "otp-not-match",
        },
        404,
      );
    }
    
  }
}
