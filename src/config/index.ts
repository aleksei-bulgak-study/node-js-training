import * as dotenv from 'dotenv';
import port from './port';

dotenv.config();
const portNumber = port();

export { portNumber as port };
