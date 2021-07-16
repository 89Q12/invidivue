import {Entity, PrimaryGeneratedColumn, Column,ManyToMany} from "typeorm";
import { Channel } from "./Channel";
@Entity()
export class User {
    @PrimaryGeneratedColumn()id: number;
    @Column()name: string;
    @Column()password: string;
    @Column()token: string;
    @Column({nullable: true})created: Date;
    @ManyToMany(type => Channel, subscription => subscription.channelid)
    subscriptions: Channel[];
}

