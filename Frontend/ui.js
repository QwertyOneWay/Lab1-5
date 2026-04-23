/** @type {HTMLFormElement} */
const createForm = document.getElementById('createForm');
/** @type {HTMLButtonElement} */
const resetBtn = document.getElementById('resetBtn');
/** @type {HTMLTableSectionElement} */
const tbody = document.getElementById('itemstablebody');
const regModal = document.getElementById('regModal');
const loginBtn = document.querySelector('.registrbtn');
/** @type {HTMLInputElement} */
const formUsernameInput = document.getElementById('username');

function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("invalid");
    document.getElementById(errorId).innerHTML = "";
}

function clearErrors() {
    clearError("theme", "theme-error");
    clearError("status", "status-error");
    clearError("priority", "priority-error");
    clearError("comment", "comment-error");
    clearError("username", "username-error");
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add('invalid');
    document.getElementById(errorId).innerHTML = message;
}

function fillForm(dto) {
    document.getElementById("theme").value = dto.theme;
    document.getElementById("priority").value = dto.priority;
    document.getElementById("comment").value = dto.comment;
    document.getElementById("username").value = dto.username;
    document.getElementById("status").value = dto.status;
}

function clearForm() {
    if (createForm) createForm.reset();
    clearErrors();
}

function rendertable(dataItems) {
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

function showRegModal() {
    if (regModal) regModal.style.display = "block";
}

function hideRegModal() {
    if (regModal) regModal.style.display = "none";
}

function updateAuthUI(user) {
    if (!loginBtn) return; // Захист від падіння!
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

function showTableLoading(isLoading) {
    if(!tbody) return;
    if (isLoading) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;"> Завантаження даних...</td></tr>';
    }
}

function showTableEmpty() {
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style ="text-align: center; color: gray;">Заявок поки немає. Створіть першу!</td></tr>';
}

function showTableError(message) {
    if(!tbody) return;
    tbody.innerHTML = `<tr><td colspan = "7" style = "text-align: center; color: red;"> Помилка: ${message}</td></tr>`;
}
