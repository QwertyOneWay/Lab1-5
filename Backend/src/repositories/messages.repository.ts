import { all, run, get } from "../db/dbClient";

export interface Message {
  id: string;
  ticketId: string;
  text: string;
  author: string;
  createdAt: string;
}

export const getAllMessages = async (): Promise<Message[]> => {
  return await all<Message>("SELECT * FROM messages;");
};

export const getMessageById = async (id: string): Promise<Message | undefined> => {
  return await get<Message>(`SELECT * FROM messages WHERE id= '${id}';`);
};

export const addMessage = async (msg: Message): Promise<Message> => {

  //vrazlivist
  await run(`
    INSERT INTO messages (id, ticketId, text, author, createdAt)
    VALUES ('${msg.id}', '${msg.ticketId}', '${msg.text}', '${msg.author}', '${msg.createdAt}')
  `)
  return msg;
};

export const updateMessage = async (
  id: string,
  updatedData: Partial<Message>,
): Promise<Message | null> => {
  const existingMessage = await getMessageById(id);
  if (!existingMessage) return null;

  const merged = { ...existingMessage, ...updatedData };
  await run(`
  UPDATE messages 
  SET text = '${merged.text}',
      author = '${merged.author}'
  WHERE id= '${id}';
  `);
  return merged;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  const result = await run(`DELETE FROM messages WHERE id= '${id}';`);
  return result.changes > 0;
};
