import winston from 'winston';
import LokiTransport from 'winston-loki';
import { config } from '../config';

const { combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(colorize(), timestamp(), myFormat),
  }),
];

if (config.loki.host) {
  transports.push(
    new LokiTransport({
      host: config.loki.host,
      labels: { app: 'blb-travel-backend' },
      json: true,
      format: combine(timestamp(), winston.format.json()),
      replaceTimestamp: true,
    })
  );
}

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(timestamp(), winston.format.json()),
  transports,
});
