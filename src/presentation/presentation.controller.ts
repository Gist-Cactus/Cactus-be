import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationListResDto } from './dto/res/presentation.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePresentationResDto } from './dto/res/createPresentation.dto';

@Controller('session/:sessionUuid/presentation')
@ApiTags('Presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Get()
  async getPresentation(
    @Param('sessionUuid') sessionUuid: string,
  ): Promise<PresentationListResDto> {
    return this.presentationService.getPresentation(sessionUuid);
  }

  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createPresentation(
    @Param('sessionUuid') sessionUuid: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreatePresentationResDto> {
    return this.presentationService.createPresentation(file, sessionUuid);
  }

  @Patch(':presentationId')
  async updatePresentation(
    @Param('presentationId', ParseIntPipe) presentationId: number,
  ): Promise<void> {
    return this.presentationService.updatePresentationStatus(presentationId);
  }
}
