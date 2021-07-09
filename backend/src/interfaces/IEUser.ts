import { Document } from 'mongoose';

// User Interface
export default interface IEUser extends Document {
	username: string;
	password: string;
	email: string;
	favoriten: [];
	admin: boolean;
}
