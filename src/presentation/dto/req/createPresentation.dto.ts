import { IsString } from 'class-validator';

export class CreatePresentationDto {
  @IsString()
  title: string;
}
