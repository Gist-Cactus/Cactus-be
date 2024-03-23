import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePresentationDto } from './dto/req/createPresentation.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PresentationListResDto } from './dto/res/presentation.dto';

@Injectable()
export class PresentationService {
  private readonly logger = new Logger(PresentationService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getPresentation(sessionUuid: string): Promise<PresentationListResDto> {
    const presentations = await this.prismaService.presentation.findMany({
      where: {
        session: {
          uuid: sessionUuid,
        },
      },
    });
    return { presentations };
  }

  async createPresentation(
    { title }: CreatePresentationDto,
    sessionUuid: string,
  ): Promise<void> {
    await this.prismaService.presentation
      .create({
        data: {
          title,
          session: {
            connect: {
              uuid: sessionUuid,
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          this.logger.error(error.message);
          throw new InternalServerErrorException('database error occurred');
        }
        this.logger.error(error.message);
        throw new InternalServerErrorException('error occurred');
      });
  }
}
