import { Request, Response, NextFunction } from "express";
import * as ticketsService from "../services/tickets.service";

export const getAllTickets = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tickets = ticketsService.getAllTickets(
      req.query as Record<string, string>,
    );
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const ticket = ticketsService.getTicketById(id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const createTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newTicket = ticketsService.createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const updatedTicket = ticketsService.updateTicket(id, req.body);
    res.status(200).json(updatedTicket);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    ticketsService.deleteTicket(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
