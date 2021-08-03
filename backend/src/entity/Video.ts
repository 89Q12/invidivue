import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn} from "typeorm";
import { User } from "./User";
import { Watch } from "./Watch";
@Entity()
export class Video{
    @PrimaryGeneratedColumn()id: number;
    @Column()ytid: string;
    @Column()seconds: number;
    @Column({type: "text"})cache: string;
    @UpdateDateColumn()lastloaded: Date;
    @JoinTable()
    @ManyToMany(type => Watch, watch => watch.id)
    watches: Watch[];
}