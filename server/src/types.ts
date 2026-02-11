import { Request, Response, NextFunction } from "express";


export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}
