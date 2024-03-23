import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ElementResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content: Prisma.JsonValue;

  @ApiProperty()
  slideId: number;
}

export class SlideResDto
  implements
    Prisma.SlideGetPayload<{
      include: { element: true };
    }>
{
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  presentationId: number;

  @ApiProperty({ type: [ElementResDto] })
  element: ElementResDto[];
}

export class SlideListResDto {
  @ApiProperty({ type: [SlideResDto] })
  slides: SlideResDto[];
}
