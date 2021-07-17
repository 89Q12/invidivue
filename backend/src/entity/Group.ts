import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable} from "typeorm";
import { User } from "./User";
@Entity()
export class Group{
    @PrimaryGeneratedColumn()id: number;
    @Column()name: string;
    
    
    @ManyToMany(type => User, user => user.id)
    
    users: User[];
}