import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import { SlideModule } from './slide/slide.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PrismaService,
    ConfigModule.forRoot({ isGlobal: true }),
    PresentationModule,
    SlideModule,
    SessionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
