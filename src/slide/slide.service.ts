import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSlideDto } from './dto/req/createSlide.dto';
import { SlideListResDto } from './dto/res/slide.dto';

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
    { title, elements }: CreateSlideDto,
    presentationId: number,
  ): Promise<void> {
    await this.prismaService.slide.create({
      data: {
        title: title,
        presentation: {
          connect: { id: presentationId },
        },
        element: {
          createMany: {
            data: elements,
          },
        },
      },
    });
  }
}
