import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSlideDto } from './dto/req/createSlide.dto';

@Injectable()
export class SlideService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSlide({ title, elements }: CreateSlideDto): Promise<void> {
    await this.prismaService.slide.create({
      data: {
        title: title,
        presentation: {
          connect: { id: 1 },
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
