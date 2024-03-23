import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/req/createSession.dto';
import { SessionListResDto } from './dto/res/session.dto';

@Controller('session')
@UsePipes(new ValidationPipe({ transform: true }))
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getSession(): Promise<SessionListResDto> {
    return this.sessionService.getSession();
  }

  @Post()
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<void> {
    return this.sessionService.createSession(createSessionDto);
  }
}
