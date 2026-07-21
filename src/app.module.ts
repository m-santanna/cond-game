import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostgresModule } from './database/postgres.module';
import { RedisModule } from './database/redis.module';

@Module({
  imports: [PostgresModule, RedisModule, UserModule],
})
export class AppModule {}
