import {Entity, PrimaryGeneratedColumn, Column,ManyToMany, JoinTable} from "typeorm";
import { Channel } from "./Channel";
import { Group } from "./Group";
@Entity()
export class User {
    @PrimaryGeneratedColumn()id: number;
    @Column()name: string;
    @Column()password: string;
    @Column()token: string;
    @Column({nullable: true})created: Date;

    @JoinTable()
    @ManyToMany(type => Channel, subscription => subscription.channelid)
    subscriptions: Channel[];
    
    @JoinTable()
    @ManyToMany(type => Group, group=>group.id)
    groups: Group[];
}

