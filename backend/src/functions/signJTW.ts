import { sign } from 'jsonwebtoken';
import logging from '../config/logging';
import IEUser from '../interfaces/IEUser';

const NAMESPACE = 'Auth';

const signJWT = (user: IEUser, callback: (error: Error | null, token: string | null) => void): void => {
	const date = new Date();
	date.setSeconds(Date.now() + parseInt(process.env.SERVER_TOKEN_EXPIRETIME_ACCESS));
	const expiredAt = parseInt(process.env.SERVER_TOKEN_EXPIRETIME_ACCESS);
	logging.info(NAMESPACE, `Attempting to sign token for ${user._id}`);
	logging.info(NAMESPACE, 'Expires in:' + date.toTimeString());
	try {
		sign(
			{
				sub: user._id,
				iat: Math.floor(Date.now() / 1000),
			},
			process.env.SERVER_TOKEN_SECRET,
			{
				issuer: process.env.SERVER_TOKEN_ISSUER,
				algorithm: 'HS256',
				expiresIn: expiredAt,
			},
			(error, token) => {
				if (error) {
					callback(error, null);
				} else if (token) {
					callback(null, token);
				}
			},
		);
	} catch (error) {
		logging.error(NAMESPACE, error.message, error);
		callback(error, null);
	}
};

export default signJWT;
