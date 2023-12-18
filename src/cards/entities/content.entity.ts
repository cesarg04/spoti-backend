import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card.entity";


@Entity('content')
export class Content {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    link: string;

    @Column('text')
    link_title: string;

    @Column('text')
    image_url: string;

    @Column('bool', {
        default: true
    })

    is_active: boolean;

    @ManyToOne(
        () => Card,
        (card) => card.contents,
        {
            onDelete: 'CASCADE'
        }
    )    
    card: Card
}