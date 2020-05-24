import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_URL) {
  throw new Error('Fail to get value of database url');
}
const DB_URL = process.env.DB_URL;

if (!process.env.PORT) {
  throw new Error('Fail to get value of application port');
}
const APP_PORT = Number.parseInt(process.env.PORT, 10);

if (!process.env.JWT_SECRET) {
  throw new Error('Fail to get value for jwt secret key');
}
const JWT_SECRET = process.env.JWT_SECRET;

export { DB_URL, APP_PORT, JWT_SECRET };
