import { Document } from 'mongoose';
import IEUser from '../interfaces/IEUser';
export default interface IERefreshToken extends Document {
	token: string;
	user: IEUser;
	expiryDate: Date;
}
