import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { CacheRepository } from './cache-repository'
import { RedisClassRepository } from './redis-cache-repository'
import { RedisService } from './redis/redis.service'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisClassRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
