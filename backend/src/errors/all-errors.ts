import { Request, Response, NextFunction } from 'express';
import BadRequestError from './bad-request-error';
import ConflictError from './conflict-error';
import DefaultError from './default-error';
import NotfoundError from './not-found-error';

type CustomError = BadRequestError | ConflictError | DefaultError | NotfoundError;

export default (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as CustomError;
  res.status(error.statusCode).send({ message: error.message });
};
