import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as passport from 'passport';
// midlleware imports
import passportStrat from './middleware/passport';
// config imports
import logging from './config/logging';
// routes imports
import * as userRoutes from './routes/user';
import * as userYoutube from './routes/youtube';
const NAMESPACE = 'Server';
/*
 * Express decleration/ socket.io decleration
 */
const app = express();

/*
 * Verbindung mit der Datenbank aufbauen
 */
/*const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

const opts = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	poolSize: 50,
	autoIndex: false,
	retryWrites: true,
	useFindAndModify: false,
};
mongoose
	.connect(url, opts)
	.then((result) => {
		logging.info(NAMESPACE, 'Deine Mongo ist Connected', result);
	})
	.catch((error) => {
		logging.error(NAMESPACE, error.message, error);
	});*/

/**
 * Log the request
 * */
app.use((req, res, next) => {
	/**
	 * Log the request
	 * */
	logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		/**
		 * Log the result
		 * */
		logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
	});

	next();
});

/*
 * Parse the body of the request
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * Passport
 *  */
passportStrat(passport);
app.use(passport.initialize());

/**
 * Rules of our API
 * */
app.use(cors({ credentials: true, origin: ['http://localhost:8080', 'http://localhost:5000'], methods: ['GET', 'POST'] }));

/**
 *  Routes go here
 *  */
app.use('/api/user', userRoutes.router);
app.use('/au', userRoutes.router);
app.use('/api/youtube', userYoutube.router);
app.use('/ay', userYoutube.router);
/**
 * Error handling
 *  */
app.use((req, res, next) => {
	const error = new Error('Not found');

	res.status(404).json({
		message: error.message,
	});
	next();
});

app.listen(process.env.SERVER_PORT, () => logging.info(NAMESPACE, `Server is running ${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`));
export default app;
