import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "./routes/notes";
import userRoutes from "./routes/user";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import session from "express-session";
import "dotenv/config";
import env from "../utils/validateEnv";
import MongoStore from "connect-mongo";
import { requireAuth } from "./middleware/auth";
import cors from "cors";

const app = express();
const corsOptions = {
    origin: env.CLIENT_URL || "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 100,
			httpOnly: true,
			secure: env.NODE_ENV === "production",
            sameSite: "none",
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_DB_STRING,
		}),
	})
);
app.use("/api/users", userRoutes);
app.use("/api/notes", requireAuth, noteRoutes);
// Handle undefined routes
app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

// Error-handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(error.message);
	let statusCode = 500;
	let errorMessage = "An unknown error occurred";
	if (isHttpError(error)) {
		statusCode = error.status;
		errorMessage = error.message;
	}

	res.status(statusCode).json({ error: errorMessage });
});

export default app;
