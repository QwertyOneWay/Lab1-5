import {TicketDto, UserDto} from "./dto";

export const createForm = document.getElementById('createForm') as HTMLFormElement | null;
export const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement | null;
export const tbody = document.getElementById('itemstablebody') as HTMLTableSectionElement | null;
export const regModal = document.getElementById('regModal') as HTMLDivElement | null;
export const loginBtn = document.querySelector('.registrbtn') as HTMLButtonElement | null;
export const formUsernameInput = document.getElementById('username') as HTMLInputElement | null;


export function clearError(inputId: string, errorId: string) {
    document.getElementById(inputId)?.classList.remove("invalid");
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.innerHTML = "";
}

export function clearErrors() {
    clearError("theme", "theme-error");
    clearError("status", "status-error");
    clearError("priority", "priority-error");
    clearError("comment", "comment-error");
    clearError("username", "username-error");
}

export function showError(inputId: string, errorId: string, message: string) {
    document.getElementById(inputId)?.classList.add('invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.innerHTML = message;
}

export function fillForm(dto: TicketDto) {
    (document.getElementById("theme") as HTMLInputElement).value = dto.theme;
    (document.getElementById("priority") as HTMLSelectElement).value = dto.priority;
    (document.getElementById("comment") as HTMLTextAreaElement).value = dto.comment;
    (document.getElementById("username") as HTMLInputElement).value = dto.username;
    (document.getElementById("status") as HTMLSelectElement).value = dto.status;
}

export function clearForm() {
    if (createForm) createForm.reset();
    clearErrors();
}

export function rendertable(dataItems: TicketDto[]) {
    if (!tbody) return;
    const rowsHtml = dataItems.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.theme}</td>
            <td>${item.status}</td>
            <td>${item.priority}</td>
            <td><div class ="scroll-wrapper">${item.comment}</div></td>
            <td>${item.username}</td>
            <td>
                <div class="table-buttons-style">
                    <button type="button" class="delete-btn" data-id="${item.id}"> Видалити </button>
                    <button type="button" class="edit-btn" data-id="${item.id}"> Редагувати </button>
                </div>
            </td>
        </tr>
        `).join('');
    tbody.innerHTML = rowsHtml;
}

export function showRegModal() {
    if (regModal) regModal.style.display = "block";
}

export function hideRegModal() {
    if (regModal) regModal.style.display = "none";
}

export function updateAuthUI(user: UserDto | null) {
    if (!loginBtn) return;
    if (user) {
        loginBtn.textContent = `Привіт, ${user.userFullName}`;
        if (formUsernameInput) {
            formUsernameInput.value = user.userFullName;
            formUsernameInput.readOnly = true;
        }
    } else {
        loginBtn.textContent = 'Увійти в акаунт';
        if (formUsernameInput) {
            formUsernameInput.value = "";
            formUsernameInput.readOnly = false;
        }
    }
}

export function showTableLoading(isLoading: boolean) {
    if(!tbody) return;
    if (isLoading) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;"> Завантаження даних...</td></tr>';
    }
}

export function showTableEmpty() {
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style ="text-align: center; color: gray;">Заявок поки немає. Створіть першу!</td></tr>';
}

export function showTableError(message: string) {
    if(!tbody) return;
    tbody.innerHTML = `<tr><td colspan = "7" style = "text-align: center; color: red;"> Помилка: ${message}</td></tr>`;
}
