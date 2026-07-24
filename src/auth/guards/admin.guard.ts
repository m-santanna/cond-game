import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { createHash, timingSafeEqual } from 'crypto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-api-key'];

    // Comma-separated ADMIN_API_KEYS supports multiple keys; empty = fail closed
    const keys = (process.env.ADMIN_API_KEYS ?? '')
      .split(',')
      .map((key) => key.trim())
      .filter(Boolean);

    if (typeof provided !== 'string' || provided === '' || keys.length === 0) {
      return false;
    }

    // Hash both sides so timingSafeEqual gets equal-length buffers
    const providedHash = createHash('sha256').update(provided).digest();
    return keys.some((key) =>
      timingSafeEqual(providedHash, createHash('sha256').update(key).digest()),
    );
  }
}
