import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { UserAuthGuard } from "src/auth/auth.guard";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { IAuthRequest } from "src/@types/authRequest";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("todos")
@ApiTags("Todo")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: "Create Todo" })
  @Post("create")
  @UseGuards(UserAuthGuard)
  async createTodo(@Body() createTodoData: CreateTodoDto, @Request() req: IAuthRequest): Promise<any> {
    return this.todosService.create(createTodoData, req.user.id);
  }

  @ApiOperation({ summary: "Get All Todo" })
  @Get()
  @UseGuards(UserAuthGuard)
  async getAllTodo(@Request() req: IAuthRequest): Promise<any> {
    return this.todosService.findAll(req.user.id);
  }

  @ApiOperation({ summary: "Get Todo by ID" })
  @Get(":id")
  @UseGuards(UserAuthGuard)
  async getTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.findOne(id);
  }

  @ApiOperation({ summary: "Complete Todo" })
  @Post("complete/:id")
  @UseGuards(UserAuthGuard)
  async completeTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.complete(id);
  }

  @ApiOperation({ summary: "Update Todo by ID and it's still uncomplete" })
  @Patch("update/:id")
  @UseGuards(UserAuthGuard)
  async updateTodo(@Param("id") id: string, @Body() updateData: UpdateTodoDto): Promise<any> {
    return this.todosService.update(id, updateData);
  }

  @ApiOperation({ summary: "Delete Todo by ID" })
  @Delete("delete/:id")
  @UseGuards(UserAuthGuard)
  async deleteTodo(@Param("id") id: string): Promise<any> {
    return this.todosService.delete(id);
  }
}
