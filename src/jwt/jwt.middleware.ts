import { NextFunction, Request, Response } from 'express';

export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('### JwtMiddleware > req.url: ', req.url);
  console.log('### JwtMiddleware > req.headers: ', req.headers);
  next();
}
