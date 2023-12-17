import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from  '@nestjs/passport'
import { Auth } from './decorators/auth.decorator';
import { validRoles } from './interfaces/valid-roles.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseInterceptors(FileInterceptor(''))
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('3030/register/admin')
  createAdmin(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createAdmin(createAuthDto)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async authGoogle(@Req() req){

  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleCallbackRedirect(@Req() req){
    return this.authService.googleLogin(req)
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto)
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('update-password')
  @Auth()
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User) {
    return this.authService.updatePassword(updatePasswordDto, user)
  }

  @Get()
  @Auth(validRoles.admin)
  findAll(@Paginate() query: PaginateQuery) {
    return this.authService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.authService.findOne(id);
  }

  @UseInterceptors(FileInterceptor(''))
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.authService.remove(id);
  }
}
