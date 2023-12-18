import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Obtener datos de ejemplo' })
  @ApiResponse({ status: 200, description: 'Operación exitosa' })
  @Auth()
  create(
    @Body() createCardDto: CreateCardDto,
    @GetUser() user: User) {
    return this.cardsService.create(createCardDto, user);
  }

  @Auth()
  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
    @GetUser() user: User
  ) {
    return this.cardsService.findAll(query, user);
  }

  @Auth()
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User) {
    return this.cardsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
