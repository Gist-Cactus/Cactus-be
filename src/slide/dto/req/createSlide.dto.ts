import { IsJSON, IsString, ValidateNested } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  title: string;

  @ValidateNested({ each: true })
  elements: CreateElementDto[];
}

export class CreateElementDto {
  @IsString()
  type: string;

  @IsJSON()
  content: string;
}
