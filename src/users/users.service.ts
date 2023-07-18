import { HttpException, Injectable } from "@nestjs/common";
import { responser } from "src/lib/Responser";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      if (users.length < 1) {
        throw new HttpException(
          {
            message: "there is no user yet",
            devMessage: "no-user-exist",
          },
          200,
        );
      }

      let result = [];

      users.map(user => {
        const { refresh_token, password, ...one } = user;
        return result.push(one);
      });

      return responser({
        statusCode: 200,
        message: "user list fatched",
        body: result,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "user list cannot be fatched",
          devMessage: err,
        },
        404,
      );
    }
  }
}
