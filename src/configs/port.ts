export default (): number => {
  if (!process.env.PORT) {
    throw new Error('Failed to start application due to absence of PORT variable');
  }
  const portString = process.env.PORT;
  return Number.parseInt(portString, 10);
};
