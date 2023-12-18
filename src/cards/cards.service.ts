import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Content } from './entities/content.entity';
import { FilterOperator, FilterSuffix, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>

  ) { }


  async create(createCardDto: CreateCardDto, user: User) {
    try {

      const card = this.cardsRepository.create({
        ...createCardDto,
        user
      })

      await this.cardsRepository.save(card)
      delete card.user
      return {
        msg: 'Tarjeta creada satisfactoriamente',
        card
      }

    } catch (error) {
      console.log(error);
    }
    return 'This action adds a new card';
  }

  // async createContent(){

  //   try {
  //     const con
  //   } catch (error) {

  //   }

  // }

  async findAll(query: PaginateQuery, user: User) {

    const queryBuilder = this.cardsRepository.createQueryBuilder('cards')

    await queryBuilder
      .where({ user })
      .execute()

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'card_title', 'user.id'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        card_title: [FilterOperator.EQ, FilterSuffix.NOT]
      }
    })

  }

  async findOne(id: string, user: User) {
    const card = await this.cardsRepository
      .createQueryBuilder()
      .where({
        user,
        id
      })
      .getOne()

    if (!card) {
      return {
        msg: 'Tarjeta no encontrada'
      }
    }
    return {
     card
    }

  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
