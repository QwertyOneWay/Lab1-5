import {v4 as uuidv4} from 'uuid';
import * as ticketsRepository from '../repositories/tickets.repository';

export interface CreateTicketDto {
    theme : string;
    status : string;
    priority : string;
    comment : string;
    username : string;
}

export const getAllTickets = () => {
    return ticketsRepository.getAllTickets();
}

export const getTicketById = (id: string) => {
    const ticket = ticketsRepository.getTicketById(id);
    if (!ticket){
        throw new Error(`NOT FOUND`);
    }
    return ticket;
};

export const createTicket = (dto: CreateTicketDto) => {
    if (!dto.theme || dto.theme.trim().length < 4) {
        throw new Error("VALIDATION_ERROR: Тема має бути не менше 4 символів");
    }
    if (!dto.status || dto.status.trim() === "") {
        throw new Error("VALIDATION_ERROR: Оберіть статус");
    }
    if (!dto.priority || dto.priority.trim() === "") {
        throw new Error('VALIDATION_ERROR: Оберіть пріоритет')
    }
    if (!dto.comment || dto.comment.trim().length < 8) {
        throw new Error("VALIDATION_ERROR: Коментар має бути мінімум 8 символів");
    }
    if (dto.comment.trim().length > 1500) {
        throw new Error("VALIDATION_ERROR: Коментар занадто довгий");
    }
    if (!dto.username || dto.username.trim().length < 5) {
        throw new Error("VALIDATION_ERROR: Ім'я має бути мінімум 5 символів");
    }

    const newTicket: ticketsRepository.Ticket = {
        id: uuidv4(),
        theme: dto.theme,
        status: dto.status,
        priority: dto.priority,
        comment: dto.comment,
        username: dto.username,
        createdAt: new Date().toISOString()
    };
    return ticketsRepository.addTicket(newTicket);
};

export const deleteTicket = (id: string) => {
    const isDeleted = ticketsRepository.deleteTicket(id);
    if (!isDeleted) {
        throw new Error(`NOT FOUND`);
    }
    return true;
};


export const updateTicket = (id: string, dto: Partial<CreateTicketDto>) => {

    if (typeof dto.theme === 'string' && dto.theme.trim().length < 4) {
        throw new Error("VALIDATION_ERROR: Тема має бути не менше 4 символів");
    }
    if (typeof dto.comment === 'string' && dto.comment.trim().length < 8) {
        throw new Error("VALIDATION_ERROR: Коментар має бути мінімум 8 символів");
    }
    if (typeof dto.comment === 'string' && dto.comment.trim().length > 1500) {
        throw new Error("VALIDATION_ERROR: Коментар занадто довгий");
    }
    const updatedTicket = ticketsRepository.updateTicket(id, dto);

    if (!updatedTicket) {
        throw new Error("NOT_FOUND");
    }

    return updatedTicket;
};
