import IERefreshToken from './IERefreshToken';
import { Model } from 'mongoose';
import IEUser from './IEUser';

export default interface RefreshTokenModel extends Model<IERefreshToken> {
	createToken(user: IEUser): Promise<string>;
	verifyExpiration(token: IERefreshToken): boolean;
}
