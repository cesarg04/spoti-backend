import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateContentDto {
    @IsString()
    link: string;
    
    @IsString()
    link_title: string;
    
    @IsString()
    image_url: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}

export class CreateContentQueryDto {
    @IsNotEmpty()
    @IsUUID()
    card_id: string;
}


