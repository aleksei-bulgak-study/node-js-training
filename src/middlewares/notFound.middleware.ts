import { Request, Response } from 'express';

export default (req: Request, res: Response): void => {
  res
    .status(404)
    .json({ message: `Url '${req.url}' for http method '${req.method}' was not found` });
};
