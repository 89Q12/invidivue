import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable} from "typeorm";
import { User } from "./User";
@Entity()
export class Channel{
    @PrimaryGeneratedColumn()id: number;
    @Column()channelid: string;
    
    @ManyToMany(type => User, user => user.id)
    users: User[];
}