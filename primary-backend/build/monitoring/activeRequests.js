"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeCountMiddleware = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const activeRequestGauge = new prom_client_1.default.Gauge({
    name: 'active_requests',
    help: 'Number of active requests',
});
const activeCountMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequestGauge.inc();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
        activeRequestGauge.dec();
    });
    next();
};
exports.activeCountMiddleware = activeCountMiddleware;
