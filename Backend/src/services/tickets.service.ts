import { v4 as uuidv4 } from "uuid";
import * as ticketsRepository from "../repositories/tickets.repository";

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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

const mapToResponseDto = (
  ticket: ticketsRepository.Ticket,
): TicketResponseDto => {
  return {
    id: ticket.id,
    theme: ticket.theme,
    status: ticket.status,
    priority: ticket.priority,
    comment: ticket.comment,
    username: ticket.username,
    createdAt: ticket.createdAt,
  };
};

export const getAllTickets = (queryParams: Record<string, string> = {},): PaginatedResponse<TicketResponseDto> => {
  let tickets = ticketsRepository.getAllTickets();

  if (queryParams.status) {
    tickets = tickets.filter((t) => t.status === queryParams.status);
  }
  if (queryParams.search) {
    const query = queryParams.search.toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.theme.toLowerCase().includes(query) ||
        t.username.toLowerCase().includes(query),
    );
  }

  if (queryParams.sortBy) {
    tickets.sort((a: ticketsRepository.Ticket, b: ticketsRepository.Ticket) => {
        let valA: string | number = a[queryParams.sortBy as keyof ticketsRepository.Ticket];
        let valB: string | number = b[queryParams.sortBy as keyof ticketsRepository.Ticket];

      if (queryParams.sortBy === "priority") {
        const priorityMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
        valA = priorityMap[valA as string] || 0;
        valB = priorityMap[valB as string] || 0;
      }

      if (valA < valB) return queryParams.sortDir === "desc" ? 1 : -1;
      if (valA > valB) return queryParams.sortDir === "desc" ? -1 : 1;
      return 0;
    });
  } else {
    tickets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const items = tickets.map(mapToResponseDto);

  return {
    items: items,
    total: items.length,
  };
};

export const getTicketById = (id: string): TicketResponseDto => {
  const ticket = ticketsRepository.getTicketById(id);
  if (!ticket) {
    throw new Error("NOT_FOUND");
  }
  return mapToResponseDto(ticket);
};

export const createTicket = (
  dto: CreateTicketRequestDto,
): TicketResponseDto => {
  const newTicket: ticketsRepository.Ticket = {
    id: uuidv4(),
    theme: dto.theme,
    status: dto.status,
    priority: dto.priority,
    comment: dto.comment,
    username: dto.username,
    createdAt: new Date().toISOString(),
  };

  const savedTicket = ticketsRepository.addTicket(newTicket);
  return mapToResponseDto(savedTicket);
};

export const updateTicket = (
  id: string,
  dto: UpdateTicketRequestDto,
): TicketResponseDto => {
  const updatedTicket = ticketsRepository.updateTicket(id, dto);

  if (!updatedTicket) {
    throw new Error("NOT_FOUND");
  }

  return mapToResponseDto(updatedTicket);
};

export const deleteTicket = (id: string): boolean => {
  const isDeleted = ticketsRepository.deleteTicket(id);
  if (!isDeleted) {
    throw new Error("NOT_FOUND");
  }
  return true;
};
