import { v4 as uuidv4 } from 'uuid';
import * as ticketsRepository from '../repositories/tickets.repository';

export interface CreateTicketRequestDto {
    theme: string;
    status: string;
    priority: string;
    comment: string;
    username: string;
}

export type UpdateTicketRequestDto = Partial<CreateTicketRequestDto>;

export interface TicketResponseDto {
    id: string;
    theme: string;
    status: string;
    priority: string;
    comment: string;
    username: string;
    createdAt: string;
}

const mapToResponseDto = (ticket: ticketsRepository.Ticket): TicketResponseDto => {
    return {
        id: ticket.id,
        theme: ticket.theme,
        status: ticket.status,
        priority: ticket.priority,
        comment: ticket.comment,
        username: ticket.username,
        createdAt: ticket.createdAt
    };
};


export const getAllTickets = (): TicketResponseDto[] => {
    return ticketsRepository.getAllTickets().map(mapToResponseDto);
};

export const getTicketById = (id: string): TicketResponseDto => {
    const ticket = ticketsRepository.getTicketById(id);
    if (!ticket) {
        throw new Error("NOT_FOUND");
    }
    return mapToResponseDto(ticket);
};

export const createTicket = (dto: CreateTicketRequestDto): TicketResponseDto => {
    if (!dto.theme || dto.theme.trim().length < 4) {
        throw new Error("VALIDATION_ERROR: Тема має бути не менше 4 символів");
    }
    if (!dto.status || dto.status.trim() === "") {
        throw new Error("VALIDATION_ERROR: Оберіть статус");
    }
    if (!dto.priority || dto.priority.trim() === "") {
        throw new Error("VALIDATION_ERROR: Оберіть пріоритет");
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

    const savedTicket = ticketsRepository.addTicket(newTicket);
    return mapToResponseDto(savedTicket);
};

export const updateTicket = (id: string, dto: UpdateTicketRequestDto): TicketResponseDto => {
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

    return mapToResponseDto(updatedTicket); // Пакуємо оновлену заявку
};

export const deleteTicket = (id: string): boolean => {
    const isDeleted = ticketsRepository.deleteTicket(id);
    if (!isDeleted) {
        throw new Error("NOT_FOUND");
    }
    return true;
};