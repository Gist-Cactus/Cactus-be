import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { ApiTags } from '@nestjs/swagger';
import { SlideListResDto } from './dto/res/slide.dto';
import { CreateElementDto, CreateSlideDto } from './dto/req/createSlide.dto';
import { CreateSlideResDto } from './dto/res/createSlide.dto';

@Controller('slide')
@ApiTags('Slide')
@UsePipes(new ValidationPipe({ transform: true }))
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Get()
  async getSlide(
    @Query('presentationId') presentationId: number,
  ): Promise<SlideListResDto> {
    return this.slideService.getSlide(presentationId);
  }

  @Post()
  async createSlide(
    @Query('presentationId') presentationId: number,
    @Body() createSlideDto: CreateSlideDto,
  ): Promise<CreateSlideResDto> {
    return this.slideService.createSlide(createSlideDto, presentationId);
  }

  @Patch()
  async updateSlide(
    @Query('slideId') slideId: number,
    @Body() createSlideDto: CreateElementDto,
  ): Promise<void> {
    return this.slideService.updateSlide(createSlideDto, slideId);
  }
}
