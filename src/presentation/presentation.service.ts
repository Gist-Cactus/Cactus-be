import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PresentationListResDto } from './dto/res/presentation.dto';
import { FileService } from 'src/file/file.service';
import { CreatePresentationResDto } from './dto/res/createPresentation.dto';
import { Status } from '@prisma/client';

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
  ): Promise<CreatePresentationResDto> {
    if (!file) {
      throw new InternalServerErrorException('file not found');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new InternalServerErrorException('file type not supported');
    }
    const title = file.originalname;
    const result = await this.prismaService.presentation
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
    await this.fileService
      .uploadFile(file, String(result.id))
      .catch((error) => {
        this.logger.error(error.message);
        throw new InternalServerErrorException('file upload error occurred');
      });
    return {
      id: result.id,
    };
  }

  async updatePresentationStatus(presentId: number): Promise<void> {
    await this.prismaService.presentation.update({
      where: {
        id: presentId,
      },
      data: {
        status: Status.COMPLETE,
      },
    });
  }
}
