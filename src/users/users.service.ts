import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export class User {
  userId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

@Injectable()
export class UsersService {
  // save only password hash
  private users = new Promise<User[]>((resolve) => {
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then((passwordHash) => {
      resolve([
        {
          userId: '1',
          username: process.env.ADMIN_NAME,
          password: passwordHash,
        },
      ]);
    });
  });

  async findOne(username: string): Promise<User | undefined> {
    return this.users.then((users) =>
      users.find((user) => user.username === username),
    );
  }
}
