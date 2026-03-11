import { Request, Response, NextFunction } from "express";

export const validateCreateTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto = req.body;
  if (!dto.theme || dto.theme.trim().length < 4)
    return next(
      new Error("VALIDATION_ERROR: Тема має бути не менше 4 символів"),
    );
  if (!dto.status || dto.status.trim() === "")
    return next(new Error("VALIDATION_ERROR: Оберіть статус"));
  if (!dto.priority || dto.priority.trim() === "")
    return next(new Error("VALIDATION_ERROR: Оберіть пріоритет"));
  if (!dto.comment || dto.comment.trim().length < 8)
    return next(
      new Error("VALIDATION_ERROR: Коментар має бути мінімум 8 символів"),
    );
  if (dto.comment.trim().length > 1500)
    return next(new Error("VALIDATION_ERROR: Коментар занадто довгий"));
  if (!dto.username || dto.username.trim().length < 5)
    return next(
      new Error("VALIDATION_ERROR: Ім'я має бути мінімум 5 символів"),
    );
  next();
};

export const validateUpdateTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto = req.body;
  if (
    dto.theme !== undefined &&
    (typeof dto.theme !== "string" || dto.theme.trim().length < 4)
  )
    return next(
      new Error("VALIDATION_ERROR: Тема має бути не менше 4 символів"),
    );
  if (
    dto.comment !== undefined &&
    (typeof dto.comment !== "string" ||
      dto.comment.trim().length < 8 ||
      dto.comment.trim().length > 1500)
  )
    return next(new Error("VALIDATION_ERROR: Некоректний коментар"));
  next();
};

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto = req.body;
  if (!dto.userFullName || dto.userFullName.trim().length < 3)
    return next(new Error("VALIDATION_ERROR: Ім'я має бути мінімум 3 символи"));
  if (!dto.userEmail || !dto.userEmail.includes("@"))
    return next(new Error("VALIDATION_ERROR: Некоректний email"));
  if (!dto.userCourse || dto.userCourse < 1 || dto.userCourse > 6)
    return next(new Error("VALIDATION_ERROR: Курс має бути від 1 до 6"));
  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto = req.body;
  if (
    dto.userFullName !== undefined &&
    (typeof dto.userFullName !== "string" || dto.userFullName.trim().length < 3)
  )
    return next(new Error("VALIDATION_ERROR: Ім'я має бути мінімум 3 символи"));
  if (
    dto.userEmail !== undefined &&
    (typeof dto.userEmail !== "string" || !dto.userEmail.includes("@"))
  )
    return next(new Error("VALIDATION_ERROR: Некоректний email"));
  if (
    dto.userCourse !== undefined &&
    (typeof dto.userCourse !== "number" ||
      dto.userCourse < 1 ||
      dto.userCourse > 6)
  )
    return next(new Error("VALIDATION_ERROR: Курс має бути від 1 до 6"));
  next();
};
