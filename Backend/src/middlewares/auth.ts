import { Request, Response, NextFunction } from "express";

export const demoAuth = (req: Request, res: Response, next: NextFunction) => {
    const rawUserId = req.header("X-Demo-UserId");

    if (!rawUserId) {
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Немає доступу (відсутній заголовок X-Demo-UserId)" }
        });
    }

    (req as any).currentUserId = decodeURIComponent(rawUserId);
    next();
};