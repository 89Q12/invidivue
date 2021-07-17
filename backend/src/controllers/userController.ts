import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { hash, compare } from 'bcrypt';
//import User from '../models/user';
import {User} from '../entity/User';
import {Group} from '../entity/Group'
import {RefreshToken} from '../entity/RefreshToken';
import signJWT from '../utils/signJTW';
import logging from '../config/logging'
import {createConnection, EntityTarget, Repository} from "typeorm";
import * as RToken from '../models/refreshToken';
var connection = createConnection();
connection.then(async conn=>{
	const groups = conn.manager.getRepository(Group);
	const creategroupifnotexists= async (groups:Repository<Group>,groupname:string):Promise<Group>=>{
		const admingroup = await groups.findOne({name:groupname});
		if(admingroup){
		}else{
			const group = new Group();
			group.name=groupname;
			groups.save(group);
			return group;
		}
		return admingroup;
	};
	const group_admin = await creategroupifnotexists(groups,"admin");
	const group_user = await creategroupifnotexists(groups,"user");

	const users = conn.manager.getRepository(User);
	const username = process.env.SERVER_ADMIN_NAME;
	const name = await users.findOne({name:username});
	if(name){
	}else{
		console.log("adding admin");
		const user = new User();
		user.name=process.env.SERVER_ADMIN_NAME;
		user.password=await hash(process.env.SERVER_ADMIN_PASSWORD,1);
		user.groups=[group_admin,group_user];
		conn.manager.save(user);
	}
	
});
// Register Funktion
const register = async (req: Request, res: Response): Promise<Response> => {
	const { username, password} = req.body;
	const conn = await connection;
	const users = await conn.manager.getRepository(User);
	const name = await users.findOne({name:username});
	if(name){
		return res.status(400).json({
			message: 'user already exists!',
		});
	}else{
		const user = new User();
		user.name=username;
		user.password=await hash(password,1);
		conn.manager.save(user);
		return res.status(200).json({
			message: 'succesfully added user',
		});
	}
	
	return res.status(400).json({
		message: 'not implemented',
	});
	/*if (resultname || resultemail) {
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
	});*/
};
//Login Funktion
const login = async (req: Request, res: Response): Promise<Response> => {
	const { username, password } = req.body;
	const conn = await connection;
	const users = conn.manager.getRepository(User);
	const user = await users.findOne({name:username});
	if(user){
		//const hashedpassword=await hash(password,1);
		//console.log(user.password);
		compare(password, user.password, (error, result) => {
			if (error ) {
				console.log(error);
				return res.status(500).json({
					message: 'Internal Server Error.',
				});
			} else if (result) {
				//console.log(result);
				signJWT(username,async (_error, token) => {
					
					if(_error){
						console.log(_error);
						return res.status(500).json({
							message: 'Internal Server Error.',
						});
					}else{
						user.token=token;
						users.save(user);
						const rtoken=await RToken.default.createToken(user);
						conn.getRepository(RefreshToken).save(rtoken);
						res.cookie('refreshtoken', rtoken.token, {
							httpOnly: true,
							secure: false,
							signed: true,
						});
						return res.status(200).json({
							message: 'Login succesful.',
							accesstoken: token,
							user: user.name,
						});
					}
				});
			}
		});
			
		
	}else{
		return res.status(400).json({
			message: 'User not found or password wrong!',
		});
	}
	
	/*User.findOne({ username })
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
		});*/
};

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
	const { refreshtoken: requesttoken } = req.signedCookies;
	
	if (requesttoken == null) {
		return res.status(403).json({ message: 'Refresh Token is required!' });
	}

	try {
		const conn = await connection;
		const rtokens = conn.getRepository(RefreshToken);
		
		const refreshToken = await rtokens.findOne({ token: requesttoken })

		if (!refreshToken) {
			res.clearCookie('refreshToken');
			res.status(403).json({ message: 'Refresh token is not in database!' });
			return;
		}

		if (RToken.default.verifyExpiration(refreshToken)) {
			res.clearCookie('refreshToken');
			//findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
			rtokens.remove(refreshToken);
			res.status(403).json({
				message: 'Refresh token was expired. Please make a new signin request',
			});
			return;
		}
		signJWT("", (_error, token) => {
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
		/*RefreshToken.findOneAndDelete({ token: requestToken }, { useFindAndModify: false })
			.exec()
			.then(() => res.status(204).json({ message: 'loggedout' }))
			.catch((err) => res.status(500).json({ message: err }));*/
	} catch (err) {
		res.status(400).json({ message: 'user was not logged in' });
	}
};

const getUser = async (req: Request, res: Response): Promise<void> => {
	const user = req.user as User;
	res.status(200).json(user);
};

const findUser = async (req: Request, res: Response): Promise<void> => {
	/*User.findOne({ _id: req.params.userId })
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
		});*/
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
	const { username, password, email, admin, favoriten } = req.body;
	const user = req.user as User;
	if (password) {
		hash(password, 10, (hashError, hash) => {
			if (hashError) {
				return res.status(401).json({
					message: hashError.message,
					error: hashError,
				});
			}
			/*User.findOneAndUpdate(
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
				);*/
		});
	} else {
		/*User.findOneAndUpdate(
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
			);*/
	}
};
const allUsers = async (req: Request, res: Response): Promise<any> => {
	const conn = await connection;
	//console.log(req.user);
	if(req.user){
		const users = await conn.manager.getRepository(User);
		const currentuser = await users.findOne(req.user);
		const groups = await conn.manager.getRepository(Group);
		const group_admin = await groups.findOne({name:"admin"});
		const sqlresult= await users.createQueryBuilder("user")
		.leftJoinAndSelect("user.groups","group")
		.where("user.id=:id",{id:currentuser.id})
		.where("group.id=:id",{id:group_admin.id})
		.getOne();
		

		if(sqlresult){
			let take = 20;
			let skip = 0;
			if(req.query["c"]){
				take = Number(req.query["c"]);
			}
			if(req.query["s"]){
				skip=Number(req.query["s"]);
			}
			const [result, total] = await users.findAndCount(
				{
					select: ["id", "name","created"],
					take: take,
					skip: skip
				}
			);
			return res.status(200).json({
				message: 'OK',
				users:result
			});
		}else{
			return res.status(400).json({
				message: 'no permission',
			});
		}
	}
	return res.status(400).json({
		message: 'not implemented',
	});
	/*User.find({})
		.then((users) => res.status(200).send(users))
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			}),
		);*/
};

const changeName = async (req: Request, res: Response): Promise<void> => {
	const { username } = req.body;
	const ID = { _id: req.params.userId };
	const update = { username: username };


	/*User.findOneAndUpdate(ID, update, {
		new: true,
	})
		.then((username) => res.status(200).send(username))
		.catch((err) =>
			res.status(500).json({
				message: err.message,
				err,
			}),
		);*/
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

		/*User.findOneAndUpdate(
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
			);*/
	});
};
export default { register, login, findUser, updateUser, logout, getUser, refreshToken, allUsers, changeName, changePassword };
