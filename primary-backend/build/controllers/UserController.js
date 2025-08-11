"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const types_1 = require("../types");
let UserController = class UserController {
    /**
     * Create a new user account
     */
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedData = types_1.SignupSchema.safeParse(body);
            if (!parsedData.success) {
                throw { status: 411, message: "Incorrect inputs" };
            }
            const userExists = yield db_1.prismaClient.user.findFirst({
                where: { email: parsedData.data.username },
            });
            if (userExists) {
                throw { status: 403, message: "User already exists" };
            }
            yield db_1.prismaClient.user.create({
                data: {
                    email: parsedData.data.username,
                    password: parsedData.data.password,
                    name: parsedData.data.name,
                },
            });
            return { message: "Please verify your account by checking your email" };
        });
    }
    /**
     * Authenticate and receive a JWT token
     */
    signin(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedData = types_1.SigninSchema.safeParse(body);
            if (!parsedData.success) {
                throw { status: 411, message: "Incorrect inputs" };
            }
            const user = yield db_1.prismaClient.user.findFirst({
                where: {
                    email: parsedData.data.username,
                    password: parsedData.data.password,
                },
            });
            if (!user) {
                throw { status: 403, message: "Sorry credentials are incorrect" };
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_PASSWORD);
            return { token };
        });
    }
    /**
     * Get the currently authenticated user
     */
    getUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield db_1.prismaClient.user.findFirst({
                where: { id },
                select: { name: true, email: true },
            });
            return { user };
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Post)("signup"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    (0, tsoa_1.Post)("signin"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)("user"),
    (0, tsoa_1.Tags)("User")
], UserController);
