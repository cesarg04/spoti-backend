import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "./content.entity";

@Entity('cards')
export class Card {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: true
    })
    card_title: string;


    @Column('text', {
        nullable: true
    })
    profile_picture: string;

    @Column('text', {
        nullable: true
    })
    cover_photo: string;

    @Column('text', {
        nullable: true
    })
    company_logo: string;

    @Column('text', {
        nullable: true
    })
    name: string;

    @Column('text', {
        nullable: true
    })
    location: string;

    @Column('text', {
        nullable: true
    })
    job_title: string;

    @Column('text', {
        nullable: true
    })
    company: string;

    @Column('text', {
        nullable: true
    })
    bio: string;

    @Column('text', {
        nullable: true
    })
    theme_color: string;

    @ManyToOne(
        () => User,
        (user) => user.cards
    )
    user: User

    @OneToMany(
        () => Content,
        (content) => content.card,
        {
            onDelete: 'CASCADE'
        }
    )
    contents: Content[]
}
