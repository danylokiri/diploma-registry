import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';

import { attachReqId } from './middleware/reqId.js';
import { logger, loggerStream } from './logger.js';
import { mountSwagger } from './docs/index.js';

import authRouter from './routes/auth.js';
import diplomasRouter from './routes/diplomas.js';
import invitesRouter from './routes/invites.js';

const app = express();

// CORS
const allowOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowOrigins.length ? allowOrigins : true, credentials: true }));

app.use(attachReqId);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: loggerStream }));

// API
app.use('/api', authRouter);
app.use('/api', diplomasRouter);
app.use('/api', invitesRouter);

// Swagger
mountSwagger(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// 404
app.use((req, res) => res.status(404).json({ status: 'error', message: 'Not Found' }));

// Error
app.use((err, _req, res, _next) => {
    // Upload problems reported by multer are client errors, not server errors.
    const uploadError = err?.code === 'INVALID_FILE_TYPE' || err?.code === 'LIMIT_FILE_SIZE';
    const httpStatus = Number(err?.status || (uploadError ? 400 : 500));
    logger.error({ err }, 'Unhandled error');
    const message = err?.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : err?.message;
    const payload = { status: 'error', message: message || 'Internal Server Error' };
    if (err?.errors && typeof err.errors === 'object') payload.errors = err.errors;
    return res.status(httpStatus).json(payload);
});

export default app;
