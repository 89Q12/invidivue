import * as JwtStrategy from 'passport-jwt';
import {createConnection} from "typeorm";
import {User} from '../entity/User';
var connection = createConnection();
const options = {
	jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SERVER_TOKEN_SECRET,
	algorithms: ['HS256'],
	passReqToCallback: true
};
/*

*/
const passportStrat = (passport): any => {
	
	passport.use(
		new JwtStrategy.Strategy(options, async function (req,jwt_payload, done) {
			//console.log(jwt_payload);
			const conn = await connection;
			const users = await conn.manager.getRepository(User);
			const user = await users.findOne({name:jwt_payload.sub});
			//console.log(jwt_payload.sub);
			if(user){
				return done(null, user);

			}else{
				return done(null, false);
			}
			/*User.findById({ _id: jwt_payload.sub }, 
				function (err, user) {
					console.log(err);
					console.log(user);
					
					if (err) {
						return done(err, false);
					}
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				}
			);*/
		}),
	);
};

export default passportStrat;
