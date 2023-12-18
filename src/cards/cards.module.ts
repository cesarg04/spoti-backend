import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Content } from './entities/content.entity';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [
    TypeOrmModule.forFeature([Card, Content]), AuthModule],
 exports: [CardsService, TypeOrmModule]
})
export class CardsModule {}
