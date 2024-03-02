import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async comparePassword(password: string, currentPassword: string) {
    return await bcrypt.compare(password, currentPassword);
  }

  async create(createUserDto: CreateUserDto): Promise<User | string> {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      const data = await this.userRepository.save({
        ...createUserDto,
      });
      delete data.password;
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const data = await this.userRepository.findOne({
        where: { email },
      });
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async validCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async findAll() {
    try {
      const data = await this.userRepository.find();
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.userRepository.findOne({
        where: { id },
      });
      delete data.password;
      return data;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isUserExist = await this.userRepository.findOne({ where: { id } });
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    delete updateUserDto.email;

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.userRepository.update(id, updateUserDto);
      return 'User updated';
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async remove(id: string) {
    const isUserExist = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.userRepository.delete(id);
      return 'User deleted';
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
