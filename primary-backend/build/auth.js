"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
// src/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "jwt") {
        const token = request.headers.authorization;
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
                request.user = { id: decoded.id };
                resolve(decoded);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    return Promise.reject(new Error("Unknown security name"));
}
