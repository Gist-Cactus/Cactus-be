import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PresentationListResDto } from './dto/res/presentation.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PresentationService {
  private readonly logger = new Logger(PresentationService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

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
    file: Express.Multer.File,
    sessionUuid: string,
  ): Promise<void> {
    if (!file) {
      throw new InternalServerErrorException('file not found');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new InternalServerErrorException('file type not supported');
    }
    const title = file.originalname.split('.')[0];
    await this.fileService.uploadFile(file, title).catch((error) => {
      this.logger.error(error.message);
      throw new InternalServerErrorException('file upload error occurred');
    });
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
