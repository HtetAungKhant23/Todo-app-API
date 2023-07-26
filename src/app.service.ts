import { Get, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getProfilePhoto(fileName: string) {
    try {
      const image = await this.prisma.file.findFirst({ where: { name: fileName } });
      if (!image) {
        throw new HttpException(
          {
            mssage: "image not found",
            devMessage: "image-not-found",
          },
          404,
        );
      }
      return image.path;
    } catch (err) {
      throw new HttpException(
        {
          message: "image not found",
          devMessage: err,
        },
        404,
      );
    }
  }
}
