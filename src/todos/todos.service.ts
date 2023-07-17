import { HttpException, Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTodoDto, id: string) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title: data.title,
          description: data.description,
          user_id: id,
        },
      });

      return responser({
        statusCode: 201,
        message: "todo created successfully",
        body: todo,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "todo cannot created",
          devMessage: err,
        },
        500,
      );
    }
  }


}
