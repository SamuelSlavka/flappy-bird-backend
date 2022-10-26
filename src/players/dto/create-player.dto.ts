import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  record: number;
}
