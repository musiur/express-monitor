import express, { Request, Response, NextFunction } from "express";
import winston from "winston";
import LokiTransport from "winston-loki";
import client from "prom-client";

const app = express();
const port = 8000;

// collect metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Configure Winston Logger with Loki Transport
const logger = winston.createLogger({
    transports: [
        new LokiTransport({
            host: "http://127.0.0.1:3100", // Grafana Loki URL
        }),
    ],
});

// Middleware for Logging Requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
    logger.info("Handled request to root route");
});

app.get("/metrics", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
