const DEFAULT_PORT_NUMBER = '3000';

// TODO: May be would be better to throw exception for failfast approach
export default (): number => {
  const portString = process.env.PORT ? process.env.PORT : DEFAULT_PORT_NUMBER;
  return Number.parseInt(portString, 10);
};
