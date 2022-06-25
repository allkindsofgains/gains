import pino from 'pino';
import pretty from 'pino-pretty';
import { root } from '../utils/directory.js';

const today = new Date().toISOString().split('T')[0];

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
};

const streams = [
  { stream: pino.destination(`${root}/logs/${today}.log`) },
  {
    stream: pretty({
      colorize: true,
      sync: true,
    }),
  },
];

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'debug',
    customLevels: levels,
    useOnlyCustomLevels: true,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream(streams),
);

export default logger;
