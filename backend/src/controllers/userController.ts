import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { hash, compare } from 'bcrypt';
import User from '../models/user';
import RefreshToken from '../models/refreshToken';
import IEUser from '../interfaces/IEUser';
import signJWT from '../utils/signJTW';

// Register Funktion
const register = async (req: Request, res: Response): Promise<Response> => {
	const { username, password, email, admin } = req.body;
	const resultname = await User.findOne({ username });
	const resultemail = await User.findOne({ email });
	if (resultname || resultemail) {
		return res.status(401).json({
			message: 'user already exists',
		});
	}
	hash(password, 1, (hashError, hash) => {
		if (hashError) {
			return res.status(401).json({
				message: hashError.message,
				error: hashError,
			});
		}

		const _user = new User({
			_id: new Types.ObjectId(),
			username,
			password: hash,
			email: email,
			favoriten: [],
			admin: admin,
		});

		return _user
			.save()
			.then(() => {
				return res.sendStatus(201);
			})
			.catch((error) => {
				return res.status(500).json({
					message: error.message,
					error,
				});
			});
	});
};
//Login Funktion
const login = async (req: Request, res: Response): Promise<void> => {
	const { username, password } = req.body;
	User.findOne({ username })
		.exec()
		.then((user) => {
			compare(password, user.password, (error, result) => {
				if (error || !result) {
					return res.status(401).json({
						message: 'Password Falsch',
					});
				} else if (result) {
					signJWT(user, async (_error, token) => {
						if (_error) {
							return res.status(500).json({
								message: _error.message,
								error: _error,
							});
						} else if (token) {
							await RefreshToken.findOneAndDelete({ user: user._id });
							const refreshToken = await RefreshToken.createToken(user);
							res.cookie('refreshToken', refreshToken, {
								httpOnly: true,
								secure: true,
								signed: true,
							});
							return res.status(200).json({
								message: 'Login erfolgreich',
								accesstoken: token,
								user: user.username,
							});
						}
					});
				}
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: 'User not found',
			});
		});
};

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
	const { refreshToken: requestToken } = req.signedCookies;

	if (requestToken == null) {
		return res.status(403).json({ message: 'Refresh Token is required!' });
	}

	try {
		const refreshToken = await RefreshToken.findOne({ token: requestToken });

		if (!refreshToken) {
			res.clearCookie('refreshToken');
			res.status(403).json({ message: 'Refresh token is not in database!' });
			return;
		}

		if (RefreshToken.verifyExpiration(refreshToken)) {
			res.clearCookie('refreshToken');
			RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

			res.status(403).json({
				message: 'Refresh token was expired. Please make a new signin request',
			});
			return;
		}
		signJWT(refreshToken.user, (_error, token) => {
			if (_error) {
				return res.status(500).json({
					message: _error.message,
					error: _error,
				});
			} else if (token) {
				return res.status(200).json({
					message: 'Refresh erfolgreich',
					accesstoken: token,
				});
			}
		});
	} catch (err) {
		return res.status(500).send({ message: err });
	}
};
const logout = async (req: Request, res: Response): Promise<void> => {
	try {
		const { refreshToken: requestToken } = req.signedCookies;
		res.clearCookie('refreshToken');
		RefreshToken.findOneAndDelete({ token: requestToken }, { useFindAndModify: false })
			.exec()
			.then(() => res.status(204).json({ message: 'loggedout' }))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		res.status(400).json({ message: 'user was not logged in' });
	}
};

const getUser = async (req: Request, res: Response): Promise<void> => {
	const user = req.user as IEUser;
	res.status(200).json(user);
};

const findUser = async (req: Request, res: Response): Promise<void> => {
	User.findOne({ _id: req.params.userId })
		.exec()
		.then((user) => {
			return res.status(200).json({
				user: user,
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message,
				error,
			});
		});
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
	const { username, password, email, admin, favoriten } = req.body;
	const user = req.user as IEUser;
	if (password) {
		hash(password, 10, (hashError, hash) => {
			if (hashError) {
				return res.status(401).json({
					message: hashError.message,
					error: hashError,
				});
			}
			User.findOneAndUpdate(
				{ _id: req.params.userId },
				{ username: username, password: hash, email: email, admin: admin },
				{
					new: true,
				},
			)
				.then((updateUser) => res.status(200).send(updateUser))
				.catch((err) =>
					res.status(500).json({
						message: err.message,
						err,
					}),
				);
		});
	} else {
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ username: username, password: user.password, email: email, admin: admin, favoriten: favoriten },
			{
				new: true,
			},
		)
			.then((updateUser) => res.status(200).send(updateUser))
			.catch((err) =>
				res.status(500).json({
					message: err.message,
					err,
				}),
			);
	}
};
const allUsers = async (req: Request, res: Response): Promise<any> => {
	User.find({})
		.then((users) => res.status(200).send(users))
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			}),
		);
};

const changeName = async (req: Request, res: Response): Promise<void> => {
	const { username } = req.body;
	const ID = { _id: req.params.userId };
	const update = { username: username };

	User.findOneAndUpdate(ID, update, {
		new: true,
	})
		.then((username) => res.status(200).send(username))
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			}),
		);
};

const changePassword = async (req: Request, res: Response): Promise<void> => {
	const { password } = req.body;
	const ID = { _id: req.params.userId };

	await hash(password, 10, (hashError, hash) => {
		if (hashError) {
			return res.status(401).json({
				message: hashError.message,
				error: hashError,
			});
		}

		User.findOneAndUpdate(
			ID,
			{ password: hash },
			{
				new: true,
			},
		)
			.then((password) => res.status(200).send(password))
			.catch((err) =>
				res.status(500).json({
					message: err.message,
					err,
				}),
			);
	});
};
export default { register, login, findUser, updateUser, logout, getUser, refreshToken, allUsers, changeName, changePassword };
