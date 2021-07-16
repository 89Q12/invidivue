import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity()
export class Channel{
    @PrimaryGeneratedColumn()id: number;
    @Column()channelid: string;
}