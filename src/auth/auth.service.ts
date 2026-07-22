import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string) {
    const user = await this.userService.getUserByUsername(username);
    const payload = { id: user.id, username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
