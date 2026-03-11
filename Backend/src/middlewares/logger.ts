import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const time = new Date().toLocaleString();

    console.log(
      `[${time}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} -  ${duration}ms`,
    );
  });
  next();
};
