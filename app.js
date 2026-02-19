const createForm = document.getElementById('createForm');
const resetBtn = document.getElementById('resetBtn');
const tbody = document.getElementById('itemstablebody');

let items = JSON.parse(localStorage.getItem("items")) || [];
let editingId = null;
function saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
}

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

function Validate(dto) {
    clearErrors()

    let isValid = true;
    const theme = dto.theme.trim();
    if (theme ==="") {
        showError("theme", "theme-error", "Обов'язкове поле");
        isValid = false;
    } if (theme.length < 4){
        showError("theme", "theme-error", "Тема має бути не менше 4 символів" );
        isValid = false;
    } else if (theme.length > 50){
        showError("theme", "theme-error", "Тема має бути не більше 50 символів" );
        isValid = false;
    }


    const stat = dto.status.trim();
    if (stat === "") {
        showError("status", "status-error", "Оберіть статус");
        isValid = false;
    }


    const priority = dto.priority.trim();
    if (priority === "") {
        showError("priority", "priority-error", "Оберіть пріоритет");
        isValid = false;
    }


    const commentary = dto.comment.trim();
    if (commentary ==="") {
        showError("comment", "comment-error", "Обов'язкове поле");
        isValid = false;
    } else if (commentary.length < 8) {
        showError("comment", "comment-error", "Напишіть детальніше (мін. 8 симв.)");
        isValid = false;
    } else if (commentary.length > 1500) {
        showError("comment", "comment-error", "Занадто багато символів!");
        isValid = false;
    }


    const username = dto.username.trim();
    if (username ==="") {
        showError("username", "username-error", "Обов'язкове поле");
        isValid = false;
    } else if (username.length < 5) {
        showError("username", "username-error", "Мінімум 5 символів");
        isValid = false;
    } else if (username.length > 65) {
        showError("username", "username-error", "Занадто багато символів");
        isValid = false;
    }
    return isValid;
}

function readForm(){
    return{
        id: Date.now().toString(),
        theme: document.getElementById("theme").value,
        status: document.getElementById("status").value,
        priority: document.getElementById("priority").value,
        comment: document.getElementById("comment").value,
        username: document.getElementById("username").value,
        createdAt: new Date().toISOString(),
    };
}

function fillForm(dto){
    document.getElementById("theme").value = dto.theme;
    document.getElementById("priority").value = dto.priority;
    document.getElementById("comment").value = dto.comment;
    document.getElementById("username").value = dto.username;
    document.getElementById("status").value = dto.status;
}

function clearForm(){
    document.getElementById("theme").value = "";
    document.getElementById("status").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("username").value = "";
}

function rendertable(items) {
    const rowsHtml = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.theme}</td>
            <td>${item.status}</td>
            <td>${item.priority}</td>
            <td><div class ="scroll-wrapper"> ${item.comment}</div></td>
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

createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dto = readForm();
    const result = Validate(dto);
    if (result === false) {
        return;
    }

    if (editingId) {
        const index = items.findIndex(item => item.id === editingId);
        if (index !== -1) {
            dto.id = items[index].id;
            dto.createdAt = items[index].createdAt;
            items[index] = dto;
        }
        editingId = null;
        createForm.reset();
        document.getElementById('addBtn').textContent = "Додати заявку";
    } else {
        items.push(dto);
    }
    saveToLocalStorage();
    rendertable(items);
    createForm.reset();
    clearForm();
});

tbody.addEventListener('click', (e) => {

    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.getAttribute('data-id');
        const item = items.find(item => item.id === id);
        if (item !== -1) {
            fillForm(item);
            editingId = id;
            document.getElementById('addBtn').textContent ='Зберегти';
        }
    }

    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        console.log('Видаляємо ID рядок:', id, typeof id);
        if (confirm('Видалити цю заявку?')) {
            items = items.filter(item => {
                console.log('Порівнюємо:', item.id, typeof item.id, 'з', id, typeof id);
                return item.id !== id
            });
            console.log('Масив після видалення:', items);
            saveToLocalStorage()
            rendertable(items);
        }
    }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredItems = items.filter(item =>
        item.theme.toLowerCase().includes(query) || item.username.toLowerCase().includes(query)
    );
    rendertable(filteredItems);
});

document.getElementById('filterStatus').addEventListener('change', (e) => {
    const statusFilter = e.target.value;
    const filteredItems = statusFilter ? items.filter(item => item.status === statusFilter) : items;
    rendertable(filteredItems);
});

document.getElementById('sortByDateBtn').addEventListener('click', () => {
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    saveToLocalStorage();
    rendertable(items);
});

document.getElementById('sortByPriorityBtn').addEventListener('click', () => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    items.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    saveToLocalStorage();
    rendertable(items);
});

resetBtn.addEventListener('click', (e) => {
    createForm.reset();
})

rendertable(items);
