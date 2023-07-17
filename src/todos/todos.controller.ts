import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { UserAuthGuard } from "src/auth/auth.guard";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { IAuthRequest } from "src/@types/authRequest";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Controller("todos")
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

  @Post('complete/:id')
  @UseGuards(UserAuthGuard)
  async completeTodo(@Param('id') id: string): Promise<any> {
    return this.todosService.complete(id);
  }

  @Post('update/:id')
  @UseGuards(UserAuthGuard)
  async updateTodo(@Param('id') id: string, @Body() updateData: UpdateTodoDto): Promise<any> {
    return this.todosService.update(id, updateData);
  }
}
