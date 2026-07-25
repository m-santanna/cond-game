import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateMapDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  size: number;
}
