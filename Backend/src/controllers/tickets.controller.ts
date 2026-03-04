import {Request, Response} from 'express';
import * as ticketsService from '../services/tickets.service';

export const getAllTickets = (req: Request, res: Response) => {
    const tickets = ticketsService.getAllTickets();
    res.status(200).json(tickets);
}

export const createTicket = (req: Request, res: Response) => {
    try {
        const dto = req.body;
        const newTicket = ticketsService.createTicket(dto);
        res.status(201).json(newTicket);
    } catch(error: any) {
        if (error.message.includes("VALIDATION_ERROR")) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};

export const updateTicket = (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const dto = req.body;

        const updatedTicket = ticketsService.updateTicket(id, dto);
        res.status(200).json(updatedTicket);
    } catch(error: any) {
        if (error.message === "NOT_FOUND") {
            res.status(404).json({error: "Not Found"});
        } else if(error.message.includes("VALIDATION_ERROR")) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};

export const deleteTicket = (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        ticketsService.deleteTicket(id);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === "NOT_FOUND") {
            res.status(404).json({ error: "Not Found" });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};