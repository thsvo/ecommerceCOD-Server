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
exports.getPreviousPasswords = exports.checkCurrentPasswordToPreviousPassword = exports.compareHashPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../config"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    return hashedPassword;
});
exports.hashPassword = hashPassword;
const compareHashPassword = (plainPass, hashPass) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plainPass, hashPass);
});
exports.compareHashPassword = compareHashPassword;
const checkCurrentPasswordToPreviousPassword = (newPass, previousPass) => __awaiter(void 0, void 0, void 0, function* () {
    let match;
    for (const passObj of previousPass) {
        const matchedPassword = yield (0, exports.compareHashPassword)(newPass, passObj.password);
        if (matchedPassword) {
            match = (0, moment_1.default)(passObj.createdAt).format("YYYY-MM-DD [at] hh:mm A");
        }
    }
    return match;
});
exports.checkCurrentPasswordToPreviousPassword = checkCurrentPasswordToPreviousPassword;
const getPreviousPasswords = (previousPass) => __awaiter(void 0, void 0, void 0, function* () {
    const sortingLastPassword = previousPass.sort((x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime());
    return sortingLastPassword[0];
});
exports.getPreviousPasswords = getPreviousPasswords;
