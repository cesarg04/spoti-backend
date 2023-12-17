import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({
        title: 'Full name',
        nullable: false
    })
    @IsString()
    @MinLength(5)
    name: string;

    @IsString()
    @MinLength(8)
    username: string;

    @ApiProperty({
        title: 'email',
        nullable: false,
        uniqueItems: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        title: 'password',
        nullable: false,
        description: 'User Lowecase, uppercase letters and numbers'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener letras mayusculas, minusculas, numeros y simbolos'
    })
    password: string

    @IsString()
    @IsOptional()
    avatar_url?: string;

    @IsOptional()
    google_provider?: boolean
}