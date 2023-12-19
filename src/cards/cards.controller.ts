import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, Query, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateContentDto, CreateContentQueryDto } from './dto/create-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

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

  @UseInterceptors(FileInterceptor(''))
  @Auth()
  @Patch('update-content/:id')
  updateContent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateContentDto: UpdateContentDto
  ) {
    return this.cardsService.updateContent(id, updateContentDto)
  }

  @UseInterceptors(FileInterceptor(''))
  @Auth()
  @Post('create-content')
  createContent(
    @Query() queries: CreateContentQueryDto,
    @Body() createContentDto: CreateContentDto,
    @GetUser() user: User
  ) {
    return this.cardsService.createContent(createContentDto, user, queries.card_id)
  }

  @Auth()
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User) {
    return this.cardsService.findCard(id, user);
  }

  @UseInterceptors(FileInterceptor(''))
  @Auth()
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCardDto: UpdateCardDto,
    @GetUser() user: User) {
    return this.cardsService.update(id, updateCardDto, user);
  }
  @Auth()
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.cardsService.remove(id, user);
  }
}
