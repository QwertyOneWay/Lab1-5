import {TicketDto, UserDto} from "./dto"

export let items: TicketDto[] = [];
export let editingId: string | null = null;

export function setItems(newItems: TicketDto[]) {
    items = newItems;
}

export function setEditingId(id: string | null) {
    editingId = id;
}

export function getEditingId(): string | null {
    return editingId;
}

export function getActiveUser(): UserDto | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) as UserDto : null;
}

export function saveActiveUser(userData: UserDto) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

export function clearActiveUser() {
    localStorage.removeItem('currentUser');
}