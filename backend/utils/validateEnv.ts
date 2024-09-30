import { cleanEnv, port, str, url } from "envalid";

export default cleanEnv(process.env, {
	MONGO_DB_STRING: str(),
	PORT: port(),
	SESSION_SECRET: str(),
	NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
	CLIENT_URL: url(),
});
