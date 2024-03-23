import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import { SlideModule } from './slide/slide.module';
import { SessionModule } from './session/session.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PresentationModule,
    SlideModule,
    SessionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
