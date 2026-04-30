import { apiClient } from './apiClient.js';
import { TicketDto, UserDto } from './dto.js';
import {
    items, editingId, setItems, setEditingId, getEditingId,
    getActiveUser, saveActiveUser, clearActiveUser
} from './state.js';
import {
    rendertable, showTableLoading, showTableEmpty, showTableError,
    createForm, tbody, loginBtn, regModal, resetBtn,
    showRegModal, hideRegModal, clearError, clearErrors, showError,
    fillForm, clearForm, updateAuthUI
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getActiveUser();
    updateAuthUI(currentUser);
    loadTickets();
});

async function loadTickets() {
    showTableLoading(true);
    try {
        const data = await apiClient.getTickets();
        setItems(data.items || []);

        if(items.length === 0){
            showTableEmpty();
        } else {
            rendertable(items);
        }

    } catch (error: any){
        showTableError(error.message);
    }
}

const closeRegBtn = document.getElementById('closeRegModal');
const regForm = document.getElementById('regForm') as HTMLFormElement | null;

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (getActiveUser()) {
            if (confirm('Бажаєте вийти з акаунту?')) {
                clearActiveUser();
                updateAuthUI(null);
            }
        } else {
            showRegModal();
        }
    });
}

if (closeRegBtn) closeRegBtn.addEventListener('click', hideRegModal);
window.addEventListener('click', (event) => {
    if (event.target === regModal) hideRegModal();
});

function ValidateRegistration(dto: UserDto): boolean {
    clearError("regFullName", "regFullName-error");
    clearError("regEmail", "regEmail-error");
    clearError("regCourse", "regCourse-error");
    const serverError = document.getElementById("regServer-error");
    if (serverError) serverError.innerHTML = "";

    let isValid = true;
    if (dto.userFullName === "") { showError("regFullName", "regFullName-error", "Обов'язкове поле"); isValid = false; }
    else if (dto.userFullName.length < 3) { showError("regFullName", "regFullName-error", "Мінімум 3 символи"); isValid = false; }
    if (dto.userEmail === "") { showError("regEmail", "regEmail-error", "Обов'язкове поле"); isValid = false; }
    else if (!dto.userEmail.includes('@')) { showError("regEmail", "regEmail-error", "Некоректний формат Email"); isValid = false; }
    if (!dto.userCourse || dto.userCourse === 0) { showError("regCourse", "regCourse-error", "Оберіть курс"); isValid = false; }
    return isValid;
}

if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('regFullName') as HTMLInputElement;
        const emailInput = document.getElementById('regEmail') as HTMLInputElement;
        const courseSelect = document.getElementById('regCourse') as HTMLSelectElement;

        const newUserDto: UserDto = {
            userFullName: nameInput.value.trim(),
            userEmail: emailInput.value.trim(),
            userCourse: courseSelect.value ? Number(courseSelect.value) : 0
        };

        if (!ValidateRegistration(newUserDto)) return;

        try {
            const savedUser = await apiClient.createUser(newUserDto);
            saveActiveUser(savedUser);
            hideRegModal();
            updateAuthUI(savedUser);
            regForm.reset();
        } catch (error: any) {
            const errEl = document.getElementById("regServer-error");
            if (errEl) errEl.innerHTML = error.message || 'Сервер недоступний';
        }
    });
}


function Validate(dto: TicketDto): boolean {
    clearErrors();
    let isValid = true;
    const theme = dto.theme.trim();
    if (theme ==="") { showError("theme", "theme-error", "Обов'язкове поле"); isValid = false; }
    else if (theme.length < 4){ showError("theme", "theme-error", "Тема має бути не менше 4 символів"); isValid = false; }
    else if (theme.length > 50){ showError("theme", "theme-error", "Тема має бути не більше 50 символів"); isValid = false; }

    const stat = dto.status.trim();
    if (stat === "") { showError("status", "status-error", "Оберіть статус"); isValid = false; }

    const priority = dto.priority.trim();
    if (priority === "") { showError("priority", "priority-error", "Оберіть пріоритет"); isValid = false; }

    const commentary = dto.comment.trim();
    if (commentary ==="") { showError("comment", "comment-error", "Обов'язкове поле"); isValid = false; }
    else if (commentary.length < 8) { showError("comment", "comment-error", "Напишіть детальніше (мін. 8 симв.)"); isValid = false; }
    else if (commentary.length > 1500) { showError("comment", "comment-error", "Занадто багато символів!"); isValid = false; }

    const username = dto.username.trim();
    if (username ==="") { showError("username", "username-error", "Обов'язкове поле"); isValid = false; }
    else if (username.length < 5) { showError("username", "username-error", "Мінімум 5 символів"); isValid = false; }
    else if (username.length > 65) { showError("username", "username-error", "Занадто багато символів"); isValid = false; }

    return isValid;
}

function readForm(): TicketDto {
    return {
        theme: (document.getElementById("theme") as HTMLInputElement).value,
        status: (document.getElementById("status") as HTMLSelectElement).value,
        priority: (document.getElementById("priority") as HTMLSelectElement).value,
        comment: (document.getElementById("comment") as HTMLTextAreaElement).value,
        username: (document.getElementById("username") as HTMLInputElement).value
    };
}

if (createForm) {
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dto = readForm();
        if (!Validate(dto)) return;

        const currentEditingId = getEditingId();

        try {
            if (currentEditingId) {
                await apiClient.updateTicket(currentEditingId, dto);
                setEditingId(null);
                const btn = document.getElementById('addBtn');
                if (btn) btn.textContent = "Додати заявку";
            } else {
                await apiClient.createTicket(dto);
            }

            await loadTickets();
            clearForm();
            updateAuthUI(getActiveUser());
        } catch(error: any) {
            alert(`Помилка: ${error.message}`);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            const item = items.find(item => String(item.id) === String(id));
            if (item) {
                fillForm(item);
                setEditingId(id ?? null);

                const btn = document.getElementById('addBtn');
                if (btn) btn.textContent = 'Зберегти';
            } else {
                console.error(`Помилка: Заявку з id [${id}] не знайдено в масиві!`);
            }
        }

        if (!target.classList.contains('edit-btn') && !target.classList.contains('delete-btn')) {
            const row = target.closest('tr');
            if (row) {
                const editBtn = row.querySelector('.edit-btn');
                const id = editBtn?.getAttribute('data-id');
                if (id) {
                    try {
                        const ticketDetails = await apiClient.getTicketById(id);
                        console.log("Деталі заявки (GET /api/v1/tickets/{id}):", ticketDetails);
                        alert(`Деталі заявки:\nТема: ${ticketDetails.theme}\nАвтор: ${ticketDetails.username}`);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }


        if (target.classList.contains('delete-btn')) {
            const id = target.getAttribute('data-id');
            if (id && confirm('Видалити цю заявку?')) {
                try {
                    await apiClient.deleteTicket(id);
                    await loadTickets();
                } catch (error: any) {
                    alert(`Помилка видалення: ${error.message}`);
                }
            }
        }
    });
}

const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const query = target.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.theme.toLowerCase().includes(query) || item.username.toLowerCase().includes(query)
        );
        rendertable(filteredItems);
    });
}

const filterStatus = document.getElementById('filterStatus') as HTMLSelectElement | null;
if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const statusVal = target.value;
        const filteredItems = statusVal ? items.filter(item => item.status === statusVal) : items;
        rendertable(filteredItems);
    });
}

const sortByDateBtn = document.getElementById('sortByDateBtn');
if (sortByDateBtn) {
    sortByDateBtn.addEventListener('click', () => {
        const sortedItems = [...items].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        rendertable(sortedItems);
    });
}

const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
if (sortByPriorityBtn) {
    sortByPriorityBtn.addEventListener('click', () => {
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const sortedItems = [...items].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        rendertable(sortedItems);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        clearForm();
        updateAuthUI(getActiveUser());
    });
}