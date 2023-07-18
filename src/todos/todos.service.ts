import { HttpException, Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { PrismaService } from "src/prisma.service";
import { responser } from "src/lib/Responser";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async notFoundTodoException() {
    return new HttpException(
      {
        message: "todo not found",
        devMessage: "todo-not-found",
        statusCode: 404,
      },
      404,
    );
  }

  async completeTodoException() {
    return new HttpException(
      {
        message: "todo is already complete",
        devMessage: "todo-is-already-completed",
        statusCode: 400,
      },
      400,
    );
  }

  async isAlreadyDone(id: string) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id,
      },
    });
    if (!todo) {
      const err = await this.notFoundTodoException();
      return { undefined, err };
    }
    if (todo?.complete_status === "DONE") {
      const err = await this.completeTodoException();
      return { undefined, err };
    } else {
      return { todo, undefined };
    }
  }

  async completedOrUncompletedTodos(id: string, status: "DONE" | "UNDONE") {
    const todos = await this.prisma.todo.findMany({
      where: {
        user_id: id,
        complete_status: status,
      },
    });

    if (todos.length < 1) {
      const err = this.notFoundTodoException();
      return { undefined, err };
    }

    return { todos, undefined };
  }

  async create(todoData: CreateTodoDto, id: string) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title: todoData.title,
          description: todoData.description,
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

  async findAll(id: string) {
    try {
      const todos = await this.prisma.todo.findMany({
        where: {
          user_id: id,
        },
      });

      if (todos.length < 1) {
        throw this.notFoundTodoException();
      }

      return responser({
        statusCode: 200,
        message: "todos fatched successfully",
        body: todos.map(todo => {
          return { id: todo.id, title: todo.title };
        }),
      });
    } catch (err) {
      throw err;
    }
  }

  async findCompleted(id: string) {
    try {
      const { todos, err } = await this.completedOrUncompletedTodos(id, "DONE");
      if (err && !todos) {
        throw err;
      }
      return responser({
        statusCode: 200,
        message: "completed todo is successfully fetched",
        body: todos,
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id },
      });

      if (!todo) {
        return this.notFoundTodoException();
      }

      return responser({
        statusCode: 200,
        message: "todo fetched successfully",
        body: todo,
      });
    } catch (err) {
      throw err;
    }
  }

  async complete(id: string) {
    try {
      const { todo, err } = await this.isAlreadyDone(id);
      if (err && !todo) {
        throw err;
      }

      const updatedTodo = await this.prisma.todo.update({
        data: {
          complete_status: "DONE",
        },
        where: {
          id,
          complete_status: "UNDONE",
        },
      });

      return responser({
        statusCode: 200,
        message: "todo is completed successfully",
        body: updatedTodo,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, updateData: UpdateTodoDto) {
    try {
      const { todo, err } = await this.isAlreadyDone(id);
      if (err && !todo) {
        throw err;
      }

      const updatedTodo = await this.prisma.todo.update({
        data: {
          title: updateData.title,
          description: updateData.description,
        },
        where: {
          id,
          complete_status: "UNDONE",
        },
      });

      return responser({
        statusCode: 200,
        message: "todo is successfully updated",
        body: updatedTodo,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string) {
    try {
      const deletedTodo = await this.prisma.todo.delete({
        where: { id },
      });

      return responser({
        statusCode: 200,
        message: "successfully deleted",
        body: deletedTodo,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: "todo not found and cannot delete",
          devMessage: "cannot-delete-todo",
        },
        404,
      );
    }
  }
}
