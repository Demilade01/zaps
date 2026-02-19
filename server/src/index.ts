import app from './app';
import config from './config';
import { startWorkers } from './workers';
import eventBridgeService from './services/event-bridge.service';
import logger from './utils/logger';

const PORT = config.port || 3001;

// Start background workers
startWorkers();

// Start Event Bridge
eventBridgeService.start();

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
    logger.info('Shutting down server...');
    eventBridgeService.stop();
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
