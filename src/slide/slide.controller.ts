import {
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SlideService } from './slide.service';

@Controller('slide')
@UsePipes(new ValidationPipe({ transform: true }))
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Get('')
  async getSlide(): Promise<void> {
    return;
  }

  @Post()
  async createSlide(): Promise<void> {}
}
