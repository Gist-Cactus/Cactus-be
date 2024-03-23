import { ApiProperty } from '@nestjs/swagger';
import { Session } from '@prisma/client';

export class SessionResDto implements Session {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}

export class SessionListResDto {
  @ApiProperty({ type: [SessionResDto] })
  sessions: SessionResDto[];
}
