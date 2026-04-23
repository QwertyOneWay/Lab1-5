//initialisation
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getActiveUser();
    updateAuthUI(currentUser);
    loadTickets();
});

async function loadTickets() {
    showTableLoading(true);
    try {
        const data = await apiClient.get('/tickets');
        items = data.items || [];

        if(items.length === 0){
            showTableEmpty();
        } else {
            rendertable(items);
        }

    } catch (error){
        showTableError(error.message);
    }
}


const closeRegBtn = document.getElementById('closeRegModal');
const regForm = document.getElementById('regForm');

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

function ValidateRegistration(dto) {
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
        /** @type {HTMLInputElement} */ const nameInput = document.getElementById('regFullName');
        /** @type {HTMLInputElement} */ const emailInput = document.getElementById('regEmail');
        /** @type {HTMLSelectElement} */ const courseSelect = document.getElementById('regCourse');

        const newUserDto = {
            userFullName: nameInput.value.trim(),
            userEmail: emailInput.value.trim(),
            userCourse: courseSelect.value ? Number(courseSelect.value) : 0
        };

        if (!ValidateRegistration(newUserDto)) return;

        try {
            const response = await fetch('http://localhost:6060/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserDto)
            });

            if (response.status === 201) {
                const savedUser = await response.json();
                saveActiveUser(savedUser);
                hideRegModal();
                updateAuthUI(savedUser);
                regForm.reset();
            } else {
                const errorData = await response.json();
                document.getElementById("regServer-error").innerHTML = errorData.error.message;
            }
        } catch (error) {
            document.getElementById("regServer-error").innerHTML = 'Сервер недоступний. Запусти Backend!';
        }
    });
}


function Validate(dto) {
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

function readForm(){
    return {
        theme: document.getElementById("theme").value,
        status: document.getElementById("status").value,
        priority: document.getElementById("priority").value,
        comment: document.getElementById("comment").value,
        username: document.getElementById("username").value
    };
}

if (createForm) {
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dto = readForm();
        if (!Validate(dto)) return;

        const ticketPayload = {
            theme: dto.theme,
            status: dto.status,
            priority: dto.priority,
            comment: dto.comment,
            username: dto.username
        };

        try {
            if (editingId) {
                await apiClient.put(`/tickets/${editingId}`, ticketPayload);
                editingId = null;
                const btn = document.getElementById('addBtn');
                if (btn) btn.textContent = "Додати заявку";
            } else {
                await apiClient.post('/tickets', ticketPayload);
            }

            await loadTickets();
            clearForm();
            updateAuthUI(getActiveUser());
        } catch(error) {
            alert(`Помилка: ${error.message}`);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async (e) => {
        /** @type {HTMLElement} */ const target = e.target;

        if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            const item = items.find(item => item.id === id);
            if (item) {
                fillForm(item);
                editingId = id;

                const btn = document.getElementById('addBtn');
                if (btn) btn.textContent = 'Зберегти';
            }
        }

        if (target.classList.contains('delete-btn')) {
            const id = target.getAttribute('data-id');
            if (confirm('Видалити цю заявку?')) {
                try {
                    await apiClient.delete(`/tickets/${id}`);
                    await loadTickets();
                } catch (error) {
                    alert(`Помилка видалення: ${error.message}`);
                }
            }
        }
    });
}


const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        /** @type {HTMLInputElement} */ const target = e.target;
        const query = target.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.theme.toLowerCase().includes(query) || item.username.toLowerCase().includes(query)
        );
        rendertable(filteredItems);
    });
}

const filterStatus = document.getElementById('filterStatus');
if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
        /** @type {HTMLSelectElement} */ const target = e.target;
        const statusVal = target.value;
        const filteredItems = statusVal ? items.filter(item => item.status === statusVal) : items;
        rendertable(filteredItems);
    });
}

const sortByDateBtn = document.getElementById('sortByDateBtn');
if (sortByDateBtn) {
    sortByDateBtn.addEventListener('click', () => {
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        rendertable(items);
    });
}

const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
if (sortByPriorityBtn) {
    sortByPriorityBtn.addEventListener('click', () => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        items.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        rendertable(items);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        clearForm();
        updateAuthUI(getActiveUser());
    });
}