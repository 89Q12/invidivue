import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn} from "typeorm";
import { User } from "./User";
@Entity()
export class Search{
    @PrimaryGeneratedColumn()id: number;
    @Column()query: string;
    @Column({type: "text"})cache: string;
    @UpdateDateColumn()lastloaded: Date;
}