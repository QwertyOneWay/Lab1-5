import {TicketDto, UserDto, MessageDto, PaginatedResponse} from "./dto";

const BASE_URL = 'http://localhost:6060/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.method === 'POST' || options.method === 'PUT') {
        console.log(` Відправляємо ${options.method} запит на ${url}`);
        console.log(` Тіло запиту (має бути JSON-рядок):`, options.body);
    }

    try{

        const response = await fetch(url, {... options, headers, signal: controller.signal, cache: 'no-store'});
        clearTimeout(timeoutId);

        if (response.status === 204) {
            return null as unknown as T;
        }
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Невідома помилка сервера");
        }
        return data as T;

    }catch(err: any){
        if(err.name === 'AbortError'){
            console.error(`[AbortError] Запит до ${endpoint} тривав занадто довго `);
            throw new Error("Сервер не відповідає. Перевищено час очікування (10с)");
        }

        console.error(`[API Client Error] ${options.method} || 'GET'} ${endpoint}:`, err);
        throw err;
    }
}

export const apiClient = {
    getTicketById: (id: string) => request<TicketDto>(`/tickets/${id}`),
    getTickets: () => request<PaginatedResponse<TicketDto>>('/tickets'),
    createTicket: (body: TicketDto) => request<TicketDto>('/tickets', { method: 'POST', body: JSON.stringify(body) }),
    updateTicket: (id: string, body: TicketDto) => request<TicketDto>(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteTicket: (id: string) => request<void>(`/tickets/${id}`, { method: 'DELETE' }),
    createUser: (body: UserDto) => request<UserDto>('/users', { method: 'POST', body: JSON.stringify(body) }),
    getMessagesByTicket: (ticketId: string) => request<PaginatedResponse<MessageDto>>(`messages?ticketId=${ticketId}`),
    createMessage: (body: MessageDto) => request<MessageDto>('/messages', { method: 'POST', body: JSON.stringify(body) })
};
