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
import { SessionListResDto, SessionResDto } from './dto/res/session.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('session')
@ApiTags('session')
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
  ): Promise<SessionResDto> {
    return this.sessionService.createSession(createSessionDto);
  }
}
