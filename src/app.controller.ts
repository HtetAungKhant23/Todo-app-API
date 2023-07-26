import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "./prisma.service";

@Controller()
export class AppController {
  constructor(private db: PrismaService) {}

  @Get("file/uploads/:fileName")
  seeUploadedFile(@Param("fileName") name: string, @Res() res: Response) {
    console.log(name);
    return res.sendFile(name, { root: `./uploads/` });
  }
}
