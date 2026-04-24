export interface TicketDto {
    id?: string;
    theme: string;
    status: string;
    priority: string;
    comment: string;
    username: string;
    createdAt?: string;
}
export interface UserDto {
    id?: string;
    userFullName: string;
    userEmail: string;
    userCourse: number;
}
export interface MessageDto {
    id?: string;
    ticketId: string;
    text: string;
    author: string;
    createdAt?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}