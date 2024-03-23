import { ApiProperty } from '@nestjs/swagger';
import { Presentation, Status } from '@prisma/client';

export class PresentationResDto implements Presentation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  session_uuid: string;
}

export class PresentationListResDto {
  @ApiProperty({ type: [PresentationResDto] })
  presentations: PresentationResDto[];
}
