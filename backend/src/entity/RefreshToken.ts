import {Entity, PrimaryColumn, Column, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { User } from "./User";
@Entity()
export class RefreshToken {
	@PrimaryColumn()
	token: string;
	
	@Column()
	expiryDate: Date;

	@ManyToOne(() => User, user => user.id)
    @JoinColumn()
	user: User;
}