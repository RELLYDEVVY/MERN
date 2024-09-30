import app from "./app";
import "dotenv/config";
import env from "../utils/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose
	.connect(env.MONGO_DB_STRING)
	.then(() => {
		console.log("Mongoose connected");
		app.listen(port, () => console.log("server runnung on port " + port));
	})
	.catch(console.error);
