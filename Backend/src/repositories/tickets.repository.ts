export interface Ticket {
  id: string;
  theme: string;
  status: string;
  priority: string;
  comment: string;
  username: string;
  createdAt: string;
}

let tickets: Ticket[] = [];

export const getAllTickets = (): Ticket[] => {
  return tickets;
};

export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find((ticket) => ticket.id === id);
};

export const addTicket = (ticket: Ticket): Ticket => {
  tickets.push(ticket);
  return ticket;
};

export const updateTicket = (
  id: string,
  updatedData: Partial<Ticket>,
): Ticket | null => {
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return null;
  tickets[index] = { ...tickets[index], ...updatedData };
  return tickets[index];
};

export const deleteTicket = (id: string): boolean => {
  const initialLength = tickets.length;
  tickets = tickets.filter((ticket) => ticket.id !== id);
  return tickets.length !== initialLength;
};
