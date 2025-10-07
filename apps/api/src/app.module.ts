import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from './prisma.service';
import { HealthController } from './health.controller';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ContentModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
