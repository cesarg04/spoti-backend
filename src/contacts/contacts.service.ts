import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { FilterOperator, FilterSuffix, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class ContactsService {

  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>
  ) { }

  async create(createContactDto: CreateContactDto, user: User) {
    try {
      const contact = this.contactsRepository.create({
        ...createContactDto,
        user
      })

      await this.contactsRepository.save(contact)

      return {
        msg: 'Contacto creado satisfactoriamente',
        contact
      }
    } catch (error) {
      console.log(error);
    }

  }

  async findAll(query: PaginateQuery, user: User) {

    const queryBuilder = this.contactsRepository.createQueryBuilder()

    queryBuilder
      .where({ user })
      .execute()

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'email', 'user.id'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
    })

  }

  private async getContact(id: string) {
    return await this.contactsRepository.findOneBy({ id })
  }

  async findOne(id: string) {
    const contact = await this.contactsRepository.findOneBy({ id })
    if (!contact) {
      throw new NotFoundException({ msg: 'Contacto no encontrado' })
    }
    return contact
  }

  async update(id: string, updateContactDto: UpdateContactDto, user: User) {


    if (Object.keys(updateContactDto).length <= 0) {
      throw new BadRequestException({ msg: 'El formulario de edicion esta vacio' });
    }
    const query = this.contactsRepository.createQueryBuilder()
    const contact = await this.findOne(id);

    if (contact instanceof Contact) {
      try {
        await query
          .update(Contact)
          .set({
            ...updateContactDto
          })
          .where("id = :id AND userId = :userId",
            {
              id: contact.id,
              userId: user.id
            })
          .execute()

        const contactUpdated = await this.contactsRepository.findOneBy({ id })

        return {
          msg: 'Contacto actualizado satisfactoriamente',
          contact: contactUpdated
        }
      } catch (error) {
        console.log(error);
        this.handleErrors(error)
      }
    }

  }

  async remove(id: string, user: User) {

    const contact = await this.findOne(id)
    const query = this.contactsRepository.createQueryBuilder()

    try {

      await query
        .delete()
        .where("id = :id and userId = :userId", {
          id: contact.id,
          userId: user.id
        })
        .execute()

      return {
        msg: 'Contacto eliminado satisfactoriamente'
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
