import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt.interface';


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id })

        if (!user) {
            throw new UnauthorizedException(`Token invalido`)
        }

        if (!user.is_active) {
            throw new UnauthorizedException('El usuario esta desactivado.')
        }

        return user;
    }


} 