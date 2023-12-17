import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { FilterOperator, FilterSuffix, PaginateQuery, paginate } from 'nestjs-paginate';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData } = createAuthDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: ['user']
      })

      await this.userRepository.save(user)
      delete user.password

      return {
        msg: 'Usuario creado satsifactoriamente',
        user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      console.log(error);
      this.handleErrors(error)
    }
  }

  async createAdmin(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: ['admin']
      })

      await this.userRepository.save(user)
      delete user.password

      return {
        msg: 'Usuario creado satsifactoriamente',
        user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      console.log(error);
      this.handleErrors(error)
    }

  }

  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) throw new UnauthorizedException({ msg: 'El correo electronico no existe' })

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException({ msg: 'La contraseña es incorrecta' })
    }
    delete user.password
    return {
      msg: 'Sesion iniciada satiosfactoriamente',
      token: this.getJwtToken({ id: user.id }),
      user
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return { msg: 'No es un usuario de google' }
    }

    const user = await this.userRepository.findOne({
      where: { email: req.user.email }
    })

    if (!user) {
      return this.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        password: uuidv4(),
        username: `${req.user.firstName.replace(/ /g, "-")}-${req.user.lastName.replace(/ /g, "-")}-${uuidv4()}`,
        avatar_url: req.user.picture,
        google_provider: true
      })
    }

    delete user.password
    return {
      msg: 'Sesion iniciada satiosfactoriamente',
      token: this.getJwtToken({ id: user.id }),
      user
    }

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      tokenL: this.getJwtToken({ id: user.id })
    };
  }

  findAll(query: PaginateQuery) {

    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name', 'is_active', 'email', 'google_provider'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC'], ['name', 'DESC']],
      searchableColumns: ['name', 'email', 'is_active'],
      select: ['id', 'name', 'email', 'role', 'is_active', 'avatar_url', 'google_provider', 'username'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        is_active: [FilterOperator.EQ, FilterSuffix.NOT]
      }
    })

  }

  async findOne(id: string) {

    const user = await this.userRepository.findOneBy({
      id
    })

    if (!user) {
      return {
        msg: 'El usuario no existe'
      }
    }
    return user
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, user: User) {

    if (!bcrypt.compareSync(updatePasswordDto.old_password, user.password))
      throw new UnauthorizedException('Old password incorrect')

    const newPass = bcrypt.hashSync(updatePasswordDto.new_password, 10);
    const query = this.userRepository.createQueryBuilder()

    try {

      await query
        .update(User)
        .set({ password: newPass })
        .where("id = :id", { id: user.id })
        .execute()

      return {
        message: 'Password updated successful'
      }
    } catch (error) {
      console.log(error)
      this.handleErrors(error)
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const query = this.userRepository.createQueryBuilder();
    const user = await this.findOne(id);
    if (user instanceof User) {
      try {
        await query
        .update(User)
        .set({
          ...updateAuthDto
        })
        .where("id = :id", { id: user.id })
        .execute()
  
        return {
          message: 'Avatar updated successfully'
        };
      } catch (error) {
        console.log(error)
        this.handleErrors(error)
      }
    }

    return user;
  }

  async remove(id: string) {

    const user = await this.findOne(id)

    if (user instanceof User) {
      user.is_active = false;
      await this.userRepository.save(user)
      return {
        msg: 'Usuario eliminado satisfactoriamente'
      }
    }
    return user
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleErrors(errors: any): never {
    if (errors.code === '23505') {
      throw new BadRequestException(errors.detail)
    }
    throw new InternalServerErrorException(`Server internal error, please check server logs`)
  }
}
