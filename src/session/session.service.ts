import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/req/createSession.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SessionListResDto } from './dto/res/session.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getSession(): Promise<SessionListResDto> {
    const sessions = await this.prismaService.session.findMany();
    return { sessions };
  }

  async createSession({ title }: CreateSessionDto): Promise<void> {
    await this.prismaService.session
      .create({
        data: {
          title,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            this.logger.debug(`Session with title: ${title} already exists`);
            throw new ConflictException(
              'Session with this title already exists',
            );
          }
          this.logger.error(error.message);
          throw new InternalServerErrorException('database error occurred');
        }
        this.logger.error(error.message);
        throw new InternalServerErrorException('error occurred');
      });
  }
}
