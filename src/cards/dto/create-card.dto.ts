import { IsOptional, IsString } from "class-validator";

export class CreateCardDto {
    @IsString()
    @IsOptional()
    card_title?: string;
  
    @IsString()
    @IsOptional()
    profile_picture?: string;
  
    @IsString()
    @IsOptional()
    cover_photo?: string;
  
    @IsString()
    @IsOptional()
    company_logo?: string;
  
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    location?: string;
  
    @IsString()
    @IsOptional()
    job_title?: string;
  
    @IsString()
    @IsOptional()
    company?: string;
  
    @IsString()
    @IsOptional()
    bio?: string;
  
    @IsString()
    @IsOptional()
    theme_color?: string;
}
