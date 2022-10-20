import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  userId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: '1',
      username: process.env.ADMIN_NAME,
      password: process.env.ADMIN_PASSWORD_HASH,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
