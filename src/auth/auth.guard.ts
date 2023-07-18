import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        {
          message: "Unauthorized",
          devMessage: "no-token-avaliable",
        },
        401,
      );
    }

    try {
      const decode = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request["user"] = decode;
      return true;
    } catch (err) {
      throw new HttpException(
        {
          message: "Unauthorized",
          devMessage: err,
        },
        401,
      );
    }
  }
}
