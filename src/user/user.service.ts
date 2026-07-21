import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`User '${username}' not found`);
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException(
        `Username '${createUserDto.username}' is already taken`,
      );
    }

    const newUser = this.userRepository.create({
      username: createUserDto.username,
    });

    return await this.userRepository.save(newUser);
  }
}
