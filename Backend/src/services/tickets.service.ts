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

export const getAllTickets = async (
  queryParams: Record<string, string> = {},
): Promise<PaginatedResponse<TicketResponseDto>> => {

  let tickets = await ticketsRepository.getAllTickets();

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
      let valA: string | number =
        a[queryParams.sortBy as keyof ticketsRepository.Ticket];
      let valB: string | number =
        b[queryParams.sortBy as keyof ticketsRepository.Ticket];

      if (queryParams.sortBy === "priority") {
        const priorityMap: Record<string, number> = {
          low: 1,
          medium: 2,
          high: 3,
        };
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

export const getTicketById = async (id: string): Promise<TicketResponseDto> => {
  const ticket = await ticketsRepository.getTicketById(id);
  if (!ticket) {
    throw new Error("NOT_FOUND");
  }
  return mapToResponseDto(ticket);
};

export const createTicket = async (
  dto: CreateTicketRequestDto,
): Promise<TicketResponseDto> => {
  const newTicket: ticketsRepository.Ticket = {
    id: uuidv4(),
    theme: dto.theme,
    status: dto.status,
    priority: dto.priority,
    comment: dto.comment,
    username: dto.username,
    createdAt: new Date().toISOString(),
  };

  const savedTicket = await ticketsRepository.addTicket(newTicket);
  return mapToResponseDto(savedTicket);
};

export const updateTicket = async (
  id: string,
  dto: UpdateTicketRequestDto,
): Promise<TicketResponseDto> => {
  const updatedTicket = await ticketsRepository.updateTicket(id, dto);

  if (!updatedTicket) {
    throw new Error("NOT_FOUND");
  }

  return mapToResponseDto(updatedTicket);
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  const isDeleted = await ticketsRepository.deleteTicket(id);
  if (!isDeleted) {
    throw new Error("NOT_FOUND");
  }
  return true;
};

export const getTicketsStats = async () =>
    await ticketsRepository.getTicketsStats();
export const getTicketsWithMessages = async () =>
    await ticketsRepository.getTicketsWithMessages();
export const getTopBugs = async () =>
    await ticketsRepository.getTopBugs();
export const searchTicketsVulnerable = async (query: string) =>
    await ticketsRepository.searchTicketsVulnerable(query);
