import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('contacts')
export class Contact {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    email: string;

    @Column('text', {
        nullable: true
    })
    professional_title: string

   @Column('text')
   phone_number: string;

   @Column('text', {
    nullable: true
   })
   job_title: string;

   @Column('text', {
    nullable: true
   })
   website: string;

   @Column('text', {
    nullable: true
   })
   address: string;

   @Column('text', {
    nullable: true
   })
   instagram_user: string;

   @Column('text', {
    nullable: true
   })
   linked_in_user: string;

   @Column('text', {
    nullable: true
   })
   note: string;

   @ManyToOne(
    () => User,
    (user) => user.contacts
   )
   user: User

   @BeforeInsert()
    checkLowerInsert(){
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkLowerUpdate(){
        this.email = this.email.toLowerCase().trim()
    }

}
