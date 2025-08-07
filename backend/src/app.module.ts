import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Configuration
import { DatabaseConfig } from './config/database.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'),
      }),
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // File upload
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      },
    }),

    // Feature modules
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseConfig],
})
export class AppModule {}