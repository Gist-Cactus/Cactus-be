import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/req/createPresentation.dto';
import { PresentationListResDto } from './dto/res/presentation.dto';

@Controller('session/:sessionUuid/presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Get()
  async getPresentation(
    @Param('sessionUuid') sessionUuid: string,
  ): Promise<PresentationListResDto> {
    return this.presentationService.getPresentation(sessionUuid);
  }

  // change this to accpet the pdf file
  @Post('')
  async createPresentation(
    @Param('sessionUuid') sessionUuid: string,
    @Body() createPresentationDto: CreatePresentationDto,
  ): Promise<void> {
    return this.presentationService.createPresentation(
      createPresentationDto,
      sessionUuid,
    );
  }
}
