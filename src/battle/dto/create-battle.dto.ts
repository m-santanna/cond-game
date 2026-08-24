import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBattleDto {
  @IsUUID()
  @IsNotEmpty()
  locationId: number;
}
