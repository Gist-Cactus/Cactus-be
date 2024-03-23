import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationListResDto } from './dto/res/presentation.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // change this to accpet the pdf file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createPresentation(
    @Param('sessionUuid') sessionUuid: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.presentationService.createPresentation(file, sessionUuid);
  }
}
