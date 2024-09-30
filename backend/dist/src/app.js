"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notes_1 = __importDefault(require("./routes/notes"));
const user_1 = __importDefault(require("./routes/user"));
const http_errors_1 = __importStar(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv/config");
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const auth_1 = require("./middleware/auth");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: validateEnv_1.default.CLIENT_URL || "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: validateEnv_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 100,
        httpOnly: true,
        secure: validateEnv_1.default.NODE_ENV === "production",
        sameSite: validateEnv_1.default.NODE_ENV === "production" ? "none" : "lax",
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: validateEnv_1.default.MONGO_DB_STRING,
    }),
}));
app.use("/api/users", user_1.default);
app.use("/api/notes", auth_1.requireAuth, notes_1.default);
// Handle undefined routes
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
// Error-handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    console.error(error.message);
    let statusCode = 500;
    let errorMessage = "An unknown error occurred";
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
