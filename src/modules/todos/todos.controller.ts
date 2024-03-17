import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  Patch,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('create')
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req,
  ): Promise<Todo> {
    const user = req.user;
    return this.todosService.create(createTodoDto, user);
  }

  @Get('get-all')
  findAll(@Req() req): Promise<Todo[]> {
    const user = req.user;
    return this.todosService.findAll(user.email);
  }

  @Get('search')
  searchTodos(@Query('q') q: string, @Req() req): Promise<Todo[]> {
    const user = req.user;
    return this.todosService.searchTodos(q, user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req): Promise<Todo> {
    const user = req.user;
    return this.todosService.findOne(id, user.sub);
  }

  @Patch('update/:id')
  updatePatch(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.todosService.update(id, updateTodoDto, user.sub, 'patch');
  }

  @Put('update/:id')
  updatePut(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.todosService.update(id, updateTodoDto, user.sub, 'put');
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.todosService.remove(id, user.email);
  }
}
