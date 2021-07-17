import {RefreshToken} from '../entity/RefreshToken';
import { randomBytes } from 'crypto';
import { User } from '../entity/User';


const createToken = async function (user:User) {
	const expiredAt = new Date();
	expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(process.env.SERVER_TOKEN_EXPIRETIME_REFRESH));
	const _token = randomBytes(64).toString('hex');

	const rtoken = new RefreshToken();
	rtoken.token= _token;
	rtoken.user= user;
	rtoken.expiryDate= expiredAt;
	

	return rtoken;
};

const verifyExpiration = (token): boolean => {
	return token.expiryDate.getTime() < new Date().getTime();
};

export default {createToken,verifyExpiration};
