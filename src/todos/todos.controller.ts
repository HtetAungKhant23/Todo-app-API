import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { UserAuthGuard } from "src/auth/auth.guard";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { IAuthRequest } from "src/@types/authRequest";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("todos")
@ApiTags("Todo")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post("create")
  @UseGuards(UserAuthGuard)
  async createTodo(@Body() createTodoData: CreateTodoDto, @Request() req: IAuthRequest): Promise<any> {
    return this.todosService.create(createTodoData, req.user.id);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getAllTodo(@Request() req: IAuthRequest): Promise<any> {
    return this.todosService.findAll(req.user.id);
  }

  @Get(":id")
  @UseGuards(UserAuthGuard)
  async getTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.findOne(id);
  }

  @Post("complete/:id")
  @UseGuards(UserAuthGuard)
  async completeTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.complete(id);
  }

  @Patch("update/:id")
  @UseGuards(UserAuthGuard)
  async updateTodo(@Param("id") id: string, @Body() updateData: UpdateTodoDto): Promise<any> {
    return this.todosService.update(id, updateData);
  }

  @Delete("delete/:id")
  @UseGuards(UserAuthGuard)
  async deleteTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.delete(id);
  }
}
