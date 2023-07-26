import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get("profile/image/:fileName")
  async seeUploadedFile(@Param("fileName") name: string, @Res() res: Response) {
    console.log(name);
    const url = await this.appService.getProfilePhoto(name);
    res.sendFile(url);
  }
}
