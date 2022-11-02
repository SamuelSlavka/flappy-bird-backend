import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Player } from './entities/player.entity';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  // TODO: add cache expiration on post/delete/update
  // @UseInterceptors(CacheInterceptor)
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'All players',
    type: [Player],
  })
  async findAll(@Request() request) {
    return this.playersService.findAll({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 8,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Get('closest')
  @ApiResponse({
    status: 200,
    description: 'All players',
    type: Player,
  })
  async getClosest(@Request() request) {
    return this.playersService.getClosestPlayer({
      record: request.query.hasOwnProperty('record') ? request.query.record : 0,
    });
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found player',
    type: Player,
  })
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.playersService.findOne(id);
  }

  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated player',
    type: Player,
  })
  update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The removed player',
    type: Player,
  })
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return { result: this.playersService.remove(id), id };
  }
}
