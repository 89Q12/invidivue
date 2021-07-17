import {Entity, PrimaryColumn, Column,ManyToMany, JoinColumn,OneToOne} from "typeorm";
import { User } from "./User";
@Entity()
export class RefreshToken {
	@PrimaryColumn()
	token: string;
	
	@Column()
	expiryDate: Date;

	@OneToOne(() => User, user => user.id)
    @JoinColumn()
	user: User;
}