"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_DB_STRING: (0, envalid_1.str)(),
    PORT: (0, envalid_1.port)(),
    SESSION_SECRET: (0, envalid_1.str)(),
    NODE_ENV: (0, envalid_1.str)({ choices: ['development', 'test', 'production'] }),
    CLIENT_URL: (0, envalid_1.url)(),
});
