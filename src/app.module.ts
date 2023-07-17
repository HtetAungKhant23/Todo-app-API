import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TodosModule } from "./todos/todos.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule,UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
