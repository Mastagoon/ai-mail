import { handler } from './build/handler.js';
import express from 'express';
import fs from 'fs';
import https from 'https';

const privateKey = fs.readFileSync('./config/ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./config/ssl/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const httpsServer = https.createServer(credentials, app);

const SSLPORT = 443;

httpsServer.listen(SSLPORT, function() {
	console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

app.use(handler);
