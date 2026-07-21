import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

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

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: createUserDto.username }],
    });

    if (existingUser) {
      throw new ConflictException(
        `Username '${createUserDto.username}' is already taken`,
      );
    }

    const userId = createUserDto.userId || uuidv4();

    const newUser = this.userRepository.create({
      username: createUserDto.username,
      userId,
    });

    return await this.userRepository.save(newUser);
  }
}