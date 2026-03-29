import { Request, Response, NextFunction } from "express";
import * as messageServices from "../services/messages.service";

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messages = await messageServices.getAllMessages(
      req.query as Record<string, string>,
    );
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
export const getMessageById = async(
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const msg = await messageServices.getMessageById(req.params.id as string);
    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newMsg = await messageServices.createMessage(req.body);
    res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedMsg = await messageServices.updateMessage(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(updatedMsg);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await messageServices.deleteMessage(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
