import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "./User";
import { Video } from "./Video";
@Entity()
export class Channel{
    @PrimaryGeneratedColumn()id: number;
    @Column()channelid: string;
    @Column({type: "text"})cache: string;
    @Column({type: "text"})newestcache: string;
    @UpdateDateColumn()lastloaded: Date;
    
    @ManyToMany(type => User, user => user.id)
    subscribers: User[];

    @OneToMany(type => Video, video => video.id)
    videos: Video[];
}