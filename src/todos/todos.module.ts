import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [TodosController],
  providers: [TodosService,PrismaService, JwtService],
})
export class TodosModule {}
