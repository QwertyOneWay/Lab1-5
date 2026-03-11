import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let errorCode = "INTERNAL_ERROR";
  let message = "Щось пішло не так на сервері";

  const errorMessage = err?.message || err?.name || String(err) || "";

  if (errorMessage === "NOT_FOUND") {
    statusCode = 404;
    errorCode = "NOT_FOUND";
    message = "Запитуваний ресурс не знайдено";
  } else if (errorMessage.includes("VALIDATION_ERROR")) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = errorMessage.split(": ")[1] || "Невалідна структура запиту";
  }

  console.error(`[Помилка ${statusCode}] ${errorCode}: ${message}`);

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
      details: [],
    },
  });
};
