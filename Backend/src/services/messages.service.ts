import { v4 as uuidv4 } from "uuid";
import * as messagesRepository from "../repositories/messages.repository";

export interface CreateMessageDto {
  ticketId: string;
  text: string;
  author: string;
}

export type UpdateMessageDto = Partial<CreateMessageDto>;

export interface MessageResponseDto {
  id: string;
  ticketId: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

const mapToResponseDto = (
  msg: messagesRepository.Message,
): MessageResponseDto => {
  return {
    id: msg.id,
    ticketId: msg.ticketId,
    text: msg.text,
    author: msg.author,
    createdAt: msg.createdAt,
  };
};

export const getAllMessages = async (
  queryParams: Record<string, string> = {},
): Promise<PaginatedResponse<MessageResponseDto>> => {
  let messages = await messagesRepository.getAllMessages();

  if (queryParams.ticketId) {
    messages = messages.filter((m) => m.ticketId === queryParams.ticketId);
  }

  messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const items = messages.map(mapToResponseDto);
  return { items, total: items.length };
};

export const getMessageById = async (id: string): Promise<MessageResponseDto> => {
  const msg =  await messagesRepository.getMessageById(id);
  if (!msg) throw new Error("NOT_FOUND");
  return mapToResponseDto(msg);
};

export const createMessage = async (dto: CreateMessageDto): Promise<MessageResponseDto> => {
  const newMessage: messagesRepository.Message = {
    id: uuidv4(),
    ticketId: dto.ticketId,
    text: dto.text,
    author: dto.author,
    createdAt: new Date().toISOString(),
  };
  const savedMsg = await messagesRepository.addMessage(newMessage);
  return mapToResponseDto(savedMsg);
};

export const updateMessage = async (
  id: string,
  dto: UpdateMessageDto,
): Promise<MessageResponseDto> => {
  const updatedMsg = await messagesRepository.updateMessage(id, dto);
  if (!updatedMsg) throw new Error("NOT_FOUND");
  return mapToResponseDto(updatedMsg);
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  const isDeleted = await messagesRepository.deleteMessage(id);
  if (!isDeleted) throw new Error("NOT_FOUND");
  return true;
};
