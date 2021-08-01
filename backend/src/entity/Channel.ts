import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn} from "typeorm";
import { User } from "./User";
@Entity()
export class Channel{
    @PrimaryGeneratedColumn()id: number;
    @Column()channelid: string;
    @Column({type: "text"})cache: string;
    @UpdateDateColumn()lastloaded: Date;
    
    @ManyToMany(type => User, user => user.id)
    users: User[];
}