import { Request, Response, NextFunction } from "express";
import * as messageServices from "../services/messages.service";

export const getAllMessages = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messages = messageServices.getAllMessages(
      req.query as Record<string, string>,
    );
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
export const getMessageById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const msg = messageServices.getMessageById(req.params.id as string);
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};

export const createMessage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newMsg = messageServices.createMessage(req.body);
    res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

export const updateMessage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedMsg = messageServices.updateMessage(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(updatedMsg);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    messageServices.deleteMessage(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
