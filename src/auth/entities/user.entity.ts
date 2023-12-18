import { ApiProperty } from "@nestjs/swagger";
import { Card } from "src/cards/entities/card.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty({
        example: '36371477-0d8f-4f34-9e06-fc17a4d09b58',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Cesar Garcia',
        description: 'Full Name',
    })
    @Column('text')
    @Column('text')
    name: string;

    @Column('text', {
        unique: true
    })
    username: string;

    @ApiProperty({
        example: 'email@google.com',
        description: 'User email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        example: '*************',
        description: 'Password',
        uniqueItems: true
    })
    @Column('text')
    password: string;

    @ApiProperty({
        type: Boolean,
        description: 'Status User',
        default: true
    })
    @Column('bool', {
        default: true
    })
    is_active: boolean;

    @Column('text', {
        nullable: true
    })
    avatar_url: string;

    @Column('bool', {
        default: false
    })
    google_provider: boolean;

    @Column('bool', {
        default: false
    })
    pro_suscription: boolean

    @Column('text', {
        nullable: true
    })
    google_id: string;

    // Role id
    // 1: Super admin, 2: User
    @ApiProperty({
        example: ['admin', 'user'],
        description: 'User ID',
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    role: string[];

    @OneToMany(
        () => Card,
        (card) => card.user
    )

    cards: Card[];

    @BeforeInsert()
    checkLowerInsert(){
        this.email = this.email.toLowerCase().trim()
        this.username = this.username.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkLowerUpdate(){
        this.email = this.email.toLowerCase().trim()
        this.username = this.username.toLowerCase().trim()
    }
}   
