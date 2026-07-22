import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Player() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
