import { Injectable, HttpException } from "@nestjs/common";
import { UserConfirmDto, UserInvite, UserLoginDto, UserReqOtp } from "./dto/user-auth.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";
import { hash, verify } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import * as path from "path";
import { IAuthRequest } from "src/@types/authRequest";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private async getTokens({ id }: { id: string }) {
    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwt.signAsync(
    //     { id },
    //     {
    //       secret: process.env.JWT_SECRET,
    //       expiresIn: "1d",
    //     },
    //   ),
    //   this.jwt.signAsync(
    //     { id },
    //     {
    //       secret: process.env.JWT_REFRESH_SECRET,
    //       expiresIn: "7d",
    //     },
    //   ),
    // ]);

    const accessToken = await this.jwt.signAsync({ id }, { secret: process.env.JWT_SECRET, expiresIn: "1d" });
    const refreshToken = await this.jwt.signAsync({ id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: "7d" });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken({ id, token }: { id: string; token: string }) {
    const hashedRefreshToekn = await hash(token);
    return this.prisma.user.update({
      where: { id },
      data: {
        refresh_token: hashedRefreshToekn,
      },
    });
  }

  private async notFoundUserHandler() {
    return new HttpException(
      {
        message: "User not found",
        devMessage: "user-not-exist",
        statusCode: 404,
      },
      404,
    );
  }

  private async createUserHandler(data: UserInvite) {
    try {
      const code: number = Math.floor(100000 + Math.random() * 900000);
      const newUser = await this.prisma.user.create({
        data: {
          phone: data.phone,
          otp: code.toString(),
          otpUsed: "UNUSED",
          profile: {
            create: {
              user_name: data.username,
              role: data.role === "USER" ? data.role : "ADMIN",
            },
          },
        },
      });

      return responser({
        statusCode: 200,
        message: "User invited successfully.",
        body: {
          user: {
            id: newUser.id,
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

      const { password, ...result } = updatedUser;

      return responser({
        statusCode: 200,
        message: "User invited successfully.",
        body: result,
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
    if (!isPasswordMatch) {
      throw new HttpException(
        {
          message: "Password not match.",
          devMessage: "user-found-password-not-match",
        },
        401,
      );
    }

    const tokens = await this.getTokens({ id: user.id });
    await this.updateRefreshToken({ id: user.id, token: tokens.refreshToken });

    return responser({
      statusCode: 200,
      message: "User login success.",
      body: {
        ...tokens,
      },
    });
  }

  async validateMe({ id }: { id: string }) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      return this.notFoundUserHandler();
    }

    const { refresh_token, password, ...result } = user;

    return responser({
      statusCode: 200,
      message: "User validated Me",
      body: result,
    });
  }

  async requestRefreshToken(refreshToken: string) {
    try {
      const decode = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const existingUser = await this.prisma.user.findFirst({ where: { id: decode.id } });
      if (!existingUser) {
        return this.notFoundUserHandler();
      }
      const isRefreshTokenMatch = await verify(existingUser.refresh_token, refreshToken);
      if (!isRefreshTokenMatch) {
        throw new HttpException(
          {
            message: "Refresh token is not valid",
            devMessage: "token-found-not-match-with-user",
          },
          401,
        );
      }

      const tokens = await this.getTokens({ id: existingUser.id });

      await this.updateRefreshToken({ id: existingUser.id, token: tokens.refreshToken });

      return responser({
        statusCode: 200,
        message: "token refreshed",
        body: tokens,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "Refresh token is not valid",
          devMessage: err,
        },
        401,
      );
    }
  }

  async requestOtp(data: UserReqOtp) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          phone: data.phone.toString(),
        },
      });

      if (!user) {
        throw await this.notFoundUserHandler();
      }

      const code: number = Math.floor(100000 + Math.random() * 900000);
      await this.prisma.user.update({
        data: {
          otp: code.toString(),
          otpUsed: "UNUSED",
        },
        where: {
          id: user.id,
        },
      });

      return responser({
        statusCode: 200,
        message: "Otp send successfully",
        body: {
          otp: code.toString(),
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async profile(req: IAuthRequest, files: Array<Express.Multer.File>) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: {
          user_id: req.user.id,
        },
      });
      if (!profile) {
        throw this.notFoundUserHandler();
      }

      files.map(async file => {
        const image = await cloudinary.uploader.upload(file.path);
        console.log(image);
        let name = file.filename;
        // let filePath = path.join(__dirname, "../.././" + file.path);
        // console.log(filePath);
        await this.prisma.file.create({
          data: {
            name,
            path: image.url,
            profile_id: profile.id,
          },
        });
      });

      const user = await this.prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          phone: true,
          profile: {
            select: {
              user_name: true,
              role: true,
              image: {
                select: {
                  path: true,
                },
              },
            },
          },
        },
      });

      return responser({
        statusCode: 200,
        message: "profile updated successfully",
        body: user,
      });
    } catch (err) {
      throw err;
    }
  }
}
