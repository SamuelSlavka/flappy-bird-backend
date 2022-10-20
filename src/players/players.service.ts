import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersRepository.save({ ...createPlayerDto });
  }

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  findOne(id: string): Promise<Player> {
    return this.playersRepository.findOneBy({ id });
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    return this.playersRepository.save({ id, ...updatePlayerDto });
  }

  async remove(id: string): Promise<void> {
    await this.playersRepository.delete(id);
  }
}
