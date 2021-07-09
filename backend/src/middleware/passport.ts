import * as JwtStrategy from 'passport-jwt';
import User from '../models/user';

const options = {
	jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SERVER_TOKEN_SECRET,
	algorithms: ['HS256'],
};

const passportStrat = (passport): any => {
	passport.use(
		new JwtStrategy.Strategy(options, function (jwt_payload, done) {
			User.findById({ _id: jwt_payload.sub }, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}),
	);
};

export default passportStrat;
