import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './players/entities/player.entity';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    PlayersModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // TODO: SECURITY PSQL GROUPS EWWww
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_URL || '172.17.0.1',
      port: Number(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'postgres',
      entities: [Player],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware);
  }
}
