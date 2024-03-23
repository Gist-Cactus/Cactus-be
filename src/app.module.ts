import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import { SlideModule } from './slide/slide.module';
import { SessionModule } from './session/session.module';
import { PresantationService } from './presantation/presantation.service';

@Module({
  imports: [
    PrismaService,
    ConfigModule.forRoot({ isGlobal: true }),
    PresentationModule,
    SlideModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [PresantationService],
})
export class AppModule {}
