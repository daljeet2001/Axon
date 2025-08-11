// src/auth.ts
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export function expressAuthentication(request: any, securityName: string, scopes?: string[]): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers.authorization;
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            }
            try {
                const decoded = jwt.verify(token, JWT_PASSWORD) as any;
                request.user = { id: decoded.id };
                resolve(decoded);
            } catch (err) {
                reject(err);
            }
        });
    }
    return Promise.reject(new Error("Unknown security name"));
}
