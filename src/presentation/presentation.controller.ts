import { Controller, Get, Post } from '@nestjs/common';
import { PresentationService } from './presentation.service';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Get('')
  async getPresentation(): Promise<void> {
    return;
  }

  @Post('')
  async createPresentation(): Promise<void> {}
}
