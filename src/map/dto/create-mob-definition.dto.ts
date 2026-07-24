import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateMobDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;

  @IsInt()
  @Min(1)
  health: number;

  @IsInt()
  @Min(1)
  attack: number;

  @IsInt()
  @Min(1)
  defense: number;
}
