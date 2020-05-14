import { InternalError } from '../models';

const DEFAULT_PORT_NUMBER = '3000';

// TODO: May be would be better to throw exception for failfast approach
export default (): number => {
  if (!process.env.PORT) {
    throw new Error('Failed to start application due to absence of PORT variable');
  }
  const portString = process.env.PORT;
  return Number.parseInt(portString, 10);
};
