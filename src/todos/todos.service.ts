import { HttpException, Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(todoData: CreateTodoDto, id: string) {
    try {
      console.log("hi hay hr from service");
      console.log(id);

      const todo = await this.prisma.todo.create({
        data: {
          title: todoData.title,
          description: todoData.description,
          user_id: id,
        },
      });

      console.log("hi from service");

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

  async findAll(id: string) {
    try {
      const todos = await this.prisma.todo.findMany({
        where: {
          user_id: id,
        },
      });

      if (todos.length < 1) {
        throw new HttpException(
          {
            message: "there is no todo",
            devMessage: "no-todo-found",
          },
          200,
        );
      }

      return responser({
        statusCode: 200,
        message: "todos fatched successfully",
        body: todos.map(todo => {
          return { id: todo.id, title: todo.title };
        }),
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "todo not found",
          devMessage: err,
        },
        404,
      );
    }
  }

  async findOne(id: string) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id },
      });
      if (!todo) {
        throw new HttpException(
          {
            message: "todo not found",
            devMessage: "todo-not-found",
          },
          404,
        );
      }
      return responser({
        statusCode: 200,
        message: "todo fetched successfully",
        body: todo,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "todo not found",
          devMessage: err,
        },
        404,
      );
    }
  }
}
