import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContactDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly professional_title: string;

  @IsString()
  readonly phone_number: string;

  @IsOptional()
  @IsString()
  readonly job_title: string;

  @IsUrl({  }, { message: 'Este campo debe ser una URL' })
  @IsOptional()
  @IsString()
  readonly website: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly instagram_user: string;

  @IsOptional()
  @IsString()
  readonly linked_in_user: string;

  @IsOptional()
  @IsString()
  readonly note: string;
}