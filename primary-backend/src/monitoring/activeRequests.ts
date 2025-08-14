import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const activeRequestGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests',
   
  
});

export const activeCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    activeRequestGauge.inc();

    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
   
        activeRequestGauge.dec();
    });

    next();
};