import { Request, Response } from 'express';

export default (error: Error, request: Request, response: Response): void => {
  response.status(500).json({ message: error.message });
};
