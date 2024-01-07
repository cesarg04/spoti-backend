import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseUUIDPipe } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @UseInterceptors(FileInterceptor(''))
  @Auth()
  @Post()
  create(
    @Body() createContactDto: CreateContactDto,
    @GetUser() user: User) {
    return this.contactsService.create(createContactDto, user);
  }

  @Auth()
  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
    @GetUser() user: User
  ) {
    return this.contactsService.findAll(query, user);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactsService.findOne(id);
  }

  @UseInterceptors(FileInterceptor(''))
  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateContactDto: UpdateContactDto,
    @GetUser() user: User) {
    return this.contactsService.update(id, updateContactDto, user);
  }

  @Auth()
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User
    ) {
    return this.contactsService.remove(id, user);
  }
}
