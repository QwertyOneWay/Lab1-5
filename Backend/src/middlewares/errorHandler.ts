import{Request, Response, NextFunction} from 'express';

export const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let message = "Щось пішло не так на сервері";

    if (err.massege === "NOT_FOUND") {
        statusCode = 404;
        errorCode = "NOT_FOUND";
        message = "Запитуваний ресурс не знайдено";
    }
    else if (err.massege.includes('VALIDATION_ERROR')) {
        statusCode = 400;
        errorCode = "VALIDATION_ERROR";
        message = err.message.split(': ')[1] || "Невалідна структура запиту";
    }

    res.status(statusCode).json({
        error:{
            code: errorCode,
            message: message,
            details: []
        }
    });
};