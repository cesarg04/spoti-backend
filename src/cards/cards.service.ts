import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Content } from './entities/content.entity';
import { FilterOperator, FilterSuffix, PaginateQuery, paginate } from 'nestjs-paginate';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

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

  async createContent(createContentDto: CreateContentDto, user: User, cardId: string) {
    const card = await this.findOne(cardId, user)
    try {
      const content = this.contentRepository.create({
        ...createContentDto,
        card
      })
      await this.contentRepository.save(content)
      return {
        msg: 'Contenido creado satisfactoriamente',
        content
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto){
    const content = await this.getContentById(id);
    if (!content) {
      throw new NotFoundException({ msg: 'Contenido no encontrado' })
    }
    const query = this.contentRepository.createQueryBuilder()
    try {
      query
      .update(Content)
      .set({
        ...updateContentDto
      })
      .where("id = :id", { id })
      .execute()

      const updated = await this.getContentById(id);

      return {
        msg: 'Contenido actualizado satisfactoriamente',
        content: updated
      }

    } catch (error) {
      this.handleErrors(error) 
    }
  }

  private async getContentById (id: string) {
    const content = await this.contentRepository.findOneBy({ id })
    return content
  }

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

  private async findOne(id: string, user: User) {
    const card = await this.cardsRepository
      .createQueryBuilder()
      .where({
        user,
        id
      })
      .getOne()
    return card
  }

  async findCard(id: string, user: User) {
    const card = await this.cardsRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, user: User) {
    if (Object.keys(updateCardDto).length <= 0) {
      throw new BadRequestException({ msg: 'El formulario de edicion esta vacio' })
    }
    const query = this.cardsRepository.createQueryBuilder()
    const card = await this.findOne(id, user)
    if (card instanceof Card) {
      try {
        await query
          .update(Card)
          .set({
            ...updateCardDto
          })
          .where("id = :id", { id: card.id })
          .execute()
        const updatedCard = await this.findOne(id, user)
        return {
          msg: 'Tarjeta actualizada satisfactoriamente',
          card: updatedCard
        }
      } catch (error) {
        console.log(error);
        this.handleErrors(error)
      }

    }
  }

  async remove(id: string, user: User) {
    const query = this.cardsRepository.createQueryBuilder('cards')
    const card = await this.findOne(id, user)
    if (!card) {
      throw new NotFoundException({ msg: `La tarjeta no existe` })
    }
    try {
      await query
        .delete()
        // .from(Card)
        .where("id = :id and userId = :userId", {
          id: card.id,
          userId: user.id
        })
        .execute()
      return {
        msg: 'Tarjeta eliminada satisfactoriamente'
      }
    } catch (error) {
      console.log(error);
      this.handleErrors(error)
    }
  }

  private handleErrors(errors: any): never {
    if (errors.code === '23505') {
      throw new BadRequestException(errors.detail)
    }
    throw new InternalServerErrorException(`Server internal error, please check server logs`)
  }
}
