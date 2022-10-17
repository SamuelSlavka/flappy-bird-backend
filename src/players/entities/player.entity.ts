import { ApiProperty } from '@nestjs/swagger';

export class Player {
  @ApiProperty()
  name: string;

  @ApiProperty()
  record: string;
}
