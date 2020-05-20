import winston, { Logger } from 'winston';
import expressWinston from 'express-winston';

export default interface LoggerService {
  info(message: string): void;
  error(message: string, error?: Error): void;
  errorDetailed(data: object): void;
  debug(data: object): void;
}

class LoggerServiceImpl implements LoggerService {
  readonly log: Logger;

  constructor() {
    this.log = winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({ filename: 'logs/exceptions.log', level: 'error' }),
        new winston.transports.Console(),
      ],
      exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
    });
  }
  info(message: string): void {
    this.log.info(message);
  }
  error(message: string, error?: Error): void {
    this.log.error(message);
    if (error) {
      this.log.error(error);
    }
  }
  errorDetailed(data: object): void {
    this.log.error(data);
  }
  debug(data: object): void {
    this.log.debug(data);
  }
}

const loggerService = new LoggerServiceImpl();
const winstonMiddleware = expressWinston.logger({
  winstonInstance: loggerService.log,
  requestWhitelist: ['url', 'method', 'query'],
});

export { loggerService, winstonMiddleware };
