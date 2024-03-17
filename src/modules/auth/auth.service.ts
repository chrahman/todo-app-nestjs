import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(email: string, password: string) {
    const user = await this.userService.validCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials 😑');
    }

    const payload = { email: user.email, sub: user.id };

    try {
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<User | string> {
    const isUserExist = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (isUserExist) {
      throw new ConflictException('User already exist 😢');
    }

    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
