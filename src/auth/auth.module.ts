import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import AuthController from "./auth.controller";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { CloudinaryProvider } from "src/lib/file.provider";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, CloudinaryProvider],
})
export class AuthModule {}
