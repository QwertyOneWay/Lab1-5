import { Request, Response, NextFunction } from "express";
import * as ticketsService from "../services/tickets.service";

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tickets = await ticketsService.getAllTickets(
      req.query as Record<string, string>,
    );
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const ticket = await ticketsService.getTicketById(id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newTicket =  await ticketsService.createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const updatedTicket = await ticketsService.updateTicket(id, req.body);
    res.status(200).json(updatedTicket);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket =  async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await ticketsService.deleteTicket(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTicketsStats = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(await ticketsService.getTicketsStats()); } catch (e) { next(e); }
};
export const getTicketsWithMessages = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(await ticketsService.getTicketsWithMessages()); } catch (e) { next(e); }
};
export const getTopBugs = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(await ticketsService.getTopBugs()); } catch (e) { next(e); }
};
export const searchTicketsVulnerable = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(await ticketsService.searchTicketsVulnerable(req.query.q as string)); } catch (e) { next(e); }
};