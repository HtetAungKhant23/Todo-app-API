import { Injectable, HttpException } from "@nestjs/common";
import { UserInvite } from "./dto/create-auth.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

    return await this.prisma.user.create({ data });
  }
}
