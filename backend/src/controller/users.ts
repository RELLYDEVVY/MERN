import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcryptjs";

interface SignUpBody {
	username?: string;
	email?: string;
	password?: string;
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
	const usernmae = req.body.username;
	const email = req.body.email;
	const passwordRaw = req.body.password;
	try {
		if (!usernmae || !email || !passwordRaw) throw createHttpError(400, "parameters missing");
		const existUser = await UserModel.findOne({ username: usernmae }).exec();
		if (existUser) throw createHttpError(409, "Username already exists, please choose a different one or login instead");
		const existEmail = await UserModel.findOne({ email: email }).exec();
		if (existEmail) throw createHttpError(409, "Email already exists");
		const passwordHash = await bcrypt.hash(passwordRaw, 10);
		const newUser = await UserModel.create({
			username: usernmae,
			email: email,
			password: passwordHash,
		});
		req.session.userId = newUser._id;
		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};
interface LoginBody {
	username?: string;
	password?: string;
}
export const Login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	try {
		if (!username || !password) throw createHttpError(400, "Parameters missing");
		const user = await UserModel.findOne({
			username: username,
		})
			.select("+password +email")
			.exec();
		if (!user) throw createHttpError(401, "Invalid Credentials");
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) throw createHttpError(401, "Invalid Credentials");
		req.session.userId = user._id;
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const getAuth: RequestHandler = async (req, res, next) => {
	const authUser = req.session.userId;
	try {
		const user = await UserModel.findById(authUser).select("+email").exec();
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const logout: RequestHandler = async (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.sendStatus(200);
		}
	});
};
