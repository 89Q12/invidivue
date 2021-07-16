import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity()
export class Group{
    @PrimaryGeneratedColumn()id: number;
    @Column()name: string;
}