import { Injectable, HttpException } from "@nestjs/common";
import { UserConfirmDto, UserInvite, UserLoginDto } from "./dto/create-auth.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";
import { hash, verify } from "argon2";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private async getTokens({ id }: { id: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: "1d",
        },
      ),
      this.jwt.signAsync(
        { id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: "7d",
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async notFoundUserHandler() {
    throw new HttpException(
      {
        message: "User not found",
        devMessage: "user-not-exist",
      },
      404,
    );
  }

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
      return this.notFoundUserHandler();
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

  async loginUser(data: UserLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: data.phone,
      },
    });

    if (!user) {
      return this.notFoundUserHandler();
    }

    const isPasswordMatch = await verify(user.password, data.password);
    if (isPasswordMatch) {
      const tokens = await this.getTokens({ id: user.id });
    }
  }
}
