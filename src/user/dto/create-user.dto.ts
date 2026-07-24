import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'Username cannot contain spaces',
  })
  username: string;
}
