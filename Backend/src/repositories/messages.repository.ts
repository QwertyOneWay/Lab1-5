export interface Message {
  id: string;
  ticketId: string;
  text: string;
  author: string;
  createdAt: string;
}

let messages: Message[] = [];

export const getAllMessages = (): Message[] => {
  return messages;
};

export const getMessageById = (id: string): Message | undefined => {
  return messages.find((message) => message.id === id);
};

export const addMessage = (msg: Message): Message => {
  messages.push(msg);
  return msg;
};

export const updateMessage = (
  id: string,
  updatedData: Partial<Message>,
): Message | null => {
  const index = messages.findIndex((msg) => msg.id === id);
  if (index === -1) return null;
  messages[index] = { ...messages[index], ...updatedData };
  return messages[index];
};

export const deleteMessage = (id: string): boolean => {
  const initialLength = messages.length;
  messages = messages.filter((msg) => msg.id !== id);
  return messages.length !== initialLength;
};
