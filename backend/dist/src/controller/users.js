"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getAuth = exports.Login = exports.signUp = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usernmae = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    try {
        if (!usernmae || !email || !passwordRaw)
            throw (0, http_errors_1.default)(400, "parameters missing");
        const existUser = yield user_1.default.findOne({ username: usernmae }).exec();
        if (existUser)
            throw (0, http_errors_1.default)(409, "Username already exists, please choose a different one or login instead");
        const existEmail = yield user_1.default.findOne({ email: email }).exec();
        if (existEmail)
            throw (0, http_errors_1.default)(409, "Email already exists");
        const passwordHash = yield bcryptjs_1.default.hash(passwordRaw, 10);
        const newUser = yield user_1.default.create({
            username: usernmae,
            email: email,
            password: passwordHash,
        });
        req.session.userId = newUser._id;
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password)
            throw (0, http_errors_1.default)(400, "Parameters missing");
        const user = yield user_1.default.findOne({
            username: username,
        })
            .select("+password +email")
            .exec();
        if (!user)
            throw (0, http_errors_1.default)(401, "Invalid Credentials");
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch)
            throw (0, http_errors_1.default)(401, "Invalid Credentials");
        req.session.userId = user._id;
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.Login = Login;
const getAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.session.userId;
    try {
        const user = yield user_1.default.findById(authUser).select("+email").exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuth = getAuth;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
});
exports.logout = logout;
