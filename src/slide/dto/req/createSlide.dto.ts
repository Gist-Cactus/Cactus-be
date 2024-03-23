import { IsJSON, IsString } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  title: string;
}

export class CreateElementDto {
  @IsString()
  type: string;

  @IsJSON()
  content: string;
}
