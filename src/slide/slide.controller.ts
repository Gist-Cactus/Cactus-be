import { Controller, Get, Post } from '@nestjs/common';
import { SlideService } from './slide.service';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Get('')
  async getSlide(): Promise<void> {
    return;
  }

  @Post()
  async createSlide(): Promise<void> {}
}
