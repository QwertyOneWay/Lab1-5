import { all, run, get } from "../db/dbClient";
import {channel} from "node:diagnostics_channel";

export interface Ticket {
  id: string;
  theme: string;
  status: string;
  priority: string;
  comment: string;
  username: string;
  createdAt: string;
}


export const getAllTickets = async (): Promise<Ticket[]> => {
  return await all<Ticket>("SELECT * FROM Tickets;");
};

export const getTicketById = async (id: string): Promise<Ticket | undefined> => {
  return await get<Ticket>(`SELECT * FROM Tickets WHERE id = '${id}' ;`);
};

export const addTicket = async (ticket: Ticket): Promise<Ticket> => {

  const safeTheme = ticket.theme.replace(/'/g, "''");
  const safeComment = ticket.comment.replace(/'/g, "''");
  const safeUsername = ticket.username.replace(/'/g, "''");

  // vrazlivist
  await run (`
  INSERT INTO Tickets (id, theme, status, priority, comment, username, createdAt) 
  VALUES ('${ticket.id}', '${safeTheme}', '${ticket.status}', '${ticket.priority}', '${safeComment}', '${safeUsername}', '${ticket.createdAt}')
  `);
  return ticket;
};

export const updateTicket = async ( id: string, updatedData: Partial<Ticket>,): Promise<Ticket | null> => {
  const existingTicket = await getTicketById(id);
  if (!existingTicket) return null;

  const merged = { ...existingTicket, ...updatedData};

  console.log(" ОТРИМАНО ID ДЛЯ ОНОВЛЕННЯ:", id);
  console.log(" ДАНІ З ФРОНТЕНДУ:", updatedData);
  console.log(" РЕЗУЛЬТАТ ЗЛИТТЯ:", merged);

  const safeTheme = merged.theme.replace(/'/g, "''");
  const safeComment = merged.comment.replace(/'/g, "''");
  const safeUsername = merged.username.replace(/'/g, "''");

  await run (`
    UPDATE Tickets
    SET theme = '${safeTheme}',
        status = '${merged.status}',
        priority = '${merged.priority}',
        comment = '${safeComment}',
        username = '${safeUsername}',
        createdAt = '${merged.createdAt}'
    WHERE id = '${id}';
  `);
  return merged as Ticket;
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  const result = await run (`DELETE FROM Tickets WHERE id = '${id}'; `);
  return result.changes > 0;
};

//kilkist zayavok
export const getTicketsStats = async (): Promise<any[]> => {
  return await all("SELECT status, COUNT(*) as count FROM Tickets GROUP BY status;");
};

//join
export const getTicketsWithMessages = async (): Promise<any[]> => {
  return await all(`
  SELECT Tickets.id, Tickets.theme, Messages.text as messageText, Messages.author
  FROM Tickets
  JOIN Messages ON Tickets.id = Messages.ticketId;
  `);
};

//where + order + limit; 2 ostanni pomylki
export const getTopBugs = async (): Promise<Ticket[]> => {
  return await all(`SELECT * FROM Tickets WHERE status = 'Bug' ORDER BY createdAt DESC LIMIT 2`);
};

//sql vrazlivist
export const searchTicketsVulnerable = async (themeQuery: string): Promise<Ticket[]> => {
  return await all<Ticket>(`SELECT * FROM Tickets WHERE theme LIKE '%${themeQuery}%';`);
};

