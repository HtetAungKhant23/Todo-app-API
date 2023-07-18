import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TodosModule } from "./todos/todos.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule, UsersModule, TodosModule],
  providers: [PrismaService],
})
export class AppModule {}
