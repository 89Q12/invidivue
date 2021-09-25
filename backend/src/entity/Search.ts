import {Entity, PrimaryGeneratedColumn, Column,ManyToMany,JoinTable,UpdateDateColumn} from "typeorm";
@Entity()
export class Search{
    @PrimaryGeneratedColumn()id: number;
    @Column()query: string;
    @Column({type: "text"})cache: string;
    @UpdateDateColumn()lastloaded: Date;
}