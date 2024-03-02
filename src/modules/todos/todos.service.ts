import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService,
  ) {}

  async create(createTodoDto: CreateTodoDto, user): Promise<Todo> {
    try {
      const data = await this.todoRepository.save({
        ...createTodoDto,
        user: user.sub,
      });
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findAll(email: string): Promise<Todo[]> {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { id, isSuperAdmin } = user;

      if (isSuperAdmin) {
        return await this.todoRepository.find();
      } else {
        return await this.todoRepository.find({
          where: {
            user: {
              id: id,
            },
          },
        });
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async searchTodos(search: string, userId): Promise<Todo[]> {
    try {
      return await this.todoRepository.find({
        where: {
          title: ILike(`%${search}%`),
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findOne(id: string, userId: string) {
    const data = await this.todoRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Todo not found');
    }

    try {
      delete data.user.password;
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId) {
    const isTodoExist = await this.todoRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!isTodoExist) {
      throw new NotFoundException('Todo not found');
    }
    try {
      await this.todoRepository.update(id, updateTodoDto);
      return 'Todo updated 🎉';
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async remove(id: string, email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found 😢');
    }

    const isTodoExist = await this.todoRepository.findOne({
      where: { id: id },
    });

    if (!isTodoExist) {
      throw new NotFoundException('Todo not found 😢');
    }

    if (!user.isSuperAdmin && isTodoExist.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this todo 😑',
      );
    }

    try {
      await this.todoRepository.delete(id);
      return 'Todo deleted 🎉';
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
