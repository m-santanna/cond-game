import { IsString, IsInt, Min } from 'class-validator';

export class CreateMobDefinitionDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  health: number;
}
