import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn} from "typeorm";
@Entity()
export class Captcha{
    @PrimaryGeneratedColumn()id: number;
    @Column()text: string;
    @Column()x: number;
    @Column()y: number;
    @Column()image: string;
}