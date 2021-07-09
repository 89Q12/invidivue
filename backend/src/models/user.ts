import { Schema, model } from 'mongoose';
import IEUser from '../interfaces/IEUser';

// Nutzer model
// Wird für anmelden genutzt
const UserSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	favoriten: [],
	admin: Boolean,
});
export default model<IEUser>('User', UserSchema);
