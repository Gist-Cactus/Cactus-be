import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateElementDto, CreateSlideDto } from './dto/req/createSlide.dto';
import { SlideListResDto } from './dto/res/slide.dto';
import { CreateSlideResDto } from './dto/res/createSlide.dto';

@Injectable()
export class SlideService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSlide(presentationId: number): Promise<SlideListResDto> {
    const slides = await this.prismaService.slide.findMany({
      where: {
        presentationId,
      },
      include: {
        element: true,
      },
    });

    return { slides };
  }

  async createSlide(
    { title }: CreateSlideDto,
    presentationId: number,
  ): Promise<CreateSlideResDto> {
    const result = await this.prismaService.slide.create({
      data: {
        title: title,
        presentation: {
          connect: { id: presentationId },
        },
      },
    });
    return { id: result.id };
  }

  async updateSlide(
    { type, content }: CreateElementDto,
    slideId: number,
  ): Promise<void> {
    await this.prismaService.element.create({
      data: {
        type,
        content,
        slide: {
          connect: { id: slideId },
        },
      },
    });
  }
}
