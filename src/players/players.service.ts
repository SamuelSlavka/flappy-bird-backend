import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Pagination } from '../pagination/pagination';
import {
  PaginationOptionsInterface,
  PositionOptionsInterface,
} from '../pagination/pagination.interfaces';
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

  async findAll(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<Player>> {
    const [results, total] = await this.playersRepository.findAndCount({
      take: options.limit,
      skip: options.page * options.limit,
      order: {
        record: 'DESC',
      },
    });

    return new Pagination<Player>({
      results,
      total,
    });
  }

  async getClosestPlayer(options: PositionOptionsInterface): Promise<Player> {
    const result = await this.playersRepository
      .createQueryBuilder()
      .addSelect('ROW_NUMBER () OVER (ORDER BY "record" DESC) as "rank"')
      .orderBy(`ABS( record - ${options.record} ) `)
      .getRawOne();

    const closestPlayer = {
      id: result.Player_id,
      name: result.Player_name,
      record: result.Player_record,
      deletedAt: result.Player_deletedAt,
      rank: result.rank,
    };
    return closestPlayer;
  }

  findOne(id: string): Promise<Player> {
    return this.playersRepository.findOneBy({ id });
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    if (id) {
      this.playersRepository.restore(id);
    }
    return this.playersRepository.save({ id, ...updatePlayerDto });
  }

  remove(id: string): Promise<UpdateResult> {
    return this.playersRepository.softDelete(id);
  }
}
