import { Schema, model } from 'mongoose';
import IERefreshToken from '../interfaces/IERefreshToken';
import RefreshTokenModel from '../interfaces/IERefreshTokenModel';
import { randomBytes } from 'crypto';
const RefreshTokenSchema = new Schema({
	token: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user) {
	const expiredAt = new Date();
	expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(process.env.SERVER_TOKEN_EXPIRETIME_REFRESH));
	const _token = randomBytes(64).toString('hex');

	const _object = new this({
		token: _token,
		user: user._id,
		expiryDate: expiredAt,
	});

	const refreshToken = await _object.save();

	return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token): boolean => {
	return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = model<IERefreshToken, RefreshTokenModel>('RefreshToken', RefreshTokenSchema);
export default RefreshToken;
