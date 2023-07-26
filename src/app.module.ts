import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TodosModule } from "./todos/todos.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from "./auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from "./app.controller";

@Module({
  imports: [AuthModule, UsersModule, TodosModule, MulterModule.register({ dest: "./uploads" })],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
