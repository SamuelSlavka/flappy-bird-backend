import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    // https://github.com/dabroek/node-cache-manager-redis-store/issues/40
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
          password: config.get('REDIS_PASSWORD'),
          username: config.get('REDIS_USERNAME'),
        });
        return {
          store: store as unknown as CacheStore,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
