import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable, ManyToOne} from "typeorm";
import { User } from "./User";
import { Video } from "./Video";
@Entity()
export class Watch{
    @PrimaryGeneratedColumn()id: number;
    @Column()progress: number;
    @ManyToOne(type => User, user => user.id)
    users: User[];
    @ManyToMany(type => Video, video => video.id)
    video: Video[];
}