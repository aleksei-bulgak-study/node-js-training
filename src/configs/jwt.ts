export default (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Failed to start application due to absence of JWT_SECRET variable');
  }
  return process.env.JWT_SECRET;
};
