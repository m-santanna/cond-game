import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { Player } from 'src/auth/decorators/player.decorator';
import { Admin } from 'src/auth/decorators/admin.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @Player()
  async getUser(@CurrentUser() user: AuthenticatedUser) {
    return await this.userService.getUserById(user.userId);
  }

  @Get('all')
  @Admin()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @Admin()
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }
}
