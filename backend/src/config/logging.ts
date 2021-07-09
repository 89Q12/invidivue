// Funktionen um bestimmte Sachen zu loggen z.b. zugriff auf irgendwelche routes
// Fehler etc
const info = (namespace: string, message: string, object?: any) => {
	if (object) {
		console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
	} else {
		console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
	}
};

const warn = (namespace: string, message: string, object?: unknown): void => {
	if (object) {
		console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
	} else {
		console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
	}
};

const error = (namespace: string, message: string, object?: unknown): void => {
	if (object) {
		console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
	} else {
		console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
	}
};

const debug = (namespace: string, message: string, object?: unknown): void => {
	if (object) {
		console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
	} else {
		console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
	}
};

const getTimeStamp = (): string => {
	return new Date().toISOString();
};

export default {
	info,
	warn,
	error,
	debug,
};
