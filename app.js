const theme1 = document.getElementById('theme');
const status1 = document.getElementById('status');
const priority1 = document.getElementById('priority');
const comment1 = document.getElementById('comment');
const username1 = document.getElementById('username');
const createForm = document.getElementById('createForm');
const resetBtn = document.getElementById('resetBtn');
const tbody = document.getElementById('itemstablebody');

let items = JSON.parse(localStorage.getItem("items")) || [];
let editingId = null;
function saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
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

    const theme = theme1.value.trim();
    const status = status1.value;
    const priority = priority1.value;
    const comment = comment1.value.trim();
    const username = username1.value.trim();

    if (!theme || !status || !priority || !comment || !username) {
        alert('Будь ласка, заповніть усі поля');
        return;
    }

    if (editingId) {
        const index = items.findIndex(item => item.id === editingId);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                theme,
                status,
                priority,
                comment,
                username,
            };
        }
        editingId = null;
        createForm.reset();
        document.getElementById('addBtn').textContent = "Додати заявку";
    } else {
        const newItem = {
            id: Date.now().toString(),
            theme,
            status,
            priority,
            comment,
            username,
            createdAt: new Date().toISOString(),
        };
        items.push(newItem);
    }

    saveToLocalStorage();
    rendertable(items);
    createForm.reset();
});


tbody.addEventListener('click', (e) => {

    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.getAttribute('data-id');
        const item = items.find(item => item.id === id);
        if (item) {
            theme1.value = item.theme;
            status1.value = item.status;
            priority1.value = item.priority;
            comment1.value = item.comment;
            username1.value = item.username;
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


document.getElementById('filterStatus').addEventListener('change', (e) => {
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












// function clearError(inputId, errorId) {
//     document.getElementById(inputId).classList.remove("invalid");
//     document.getElementById(errorId).innerHTML = "";
// }
// function clearErrors() {
//     clearError("theme", "theme-error");
//     clearError("status", "status-error");
//     clearError("priority", "priority-error");
//     clearError("comment", "comment-error");
//     clearError("username", "username-error");
// }
//
// function showError(inputId, errorId, message) {
//     document.getElementById(inputId).classList.add('invalid');
//     document.getElementById(errorId).innerHTML = message;
// }
//
//
// function Validate(dto) {
//     clearError()
//
//     let isValid = true;
//     const theme = dto.theme.trim();
//     if (theme ==="") {
//         showError("theme", "theme-error", "Тема має бути не менше 3 символів");
//         isValid = false;
//     }
//
//
//     const stat = dto.status.trim();
//     if (stat === "") {
//         showError("status", "status-error", "Оберіть статус зі списку");
//         isValid = false;
//     }
//
//
//     const priority = dto.priority.trim();
//     if (priority === "") {
//         showError("priority", "priority-error", "Оберіть пріоритет");
//         isValid = false;
//     }
//
//
//     const commentary = dto.comment.trim();
//     if (commentary ==="") {
//         showError("comment", "comment-error", "Напишіть детальніше (мін. 8 симв.)");
//         isValid = false;
//     }
//
//
//     const username = dto.username.trim();
//     if (username ==="") {
//         showError("username", "username-error", "Введіть повне ПІБ");
//         isValid = false;
//     }
//
//     return isValid;
// }
//
// function readForm(){
//     return{
//         id: Date.now().toString(),
//         theme: document.getElementById("theme").value,
//         status: document.getElementById("status").value,
//         priority: document.getElementById("priority").value,
//         comment: document.getElementById("comment").value,
//         username: document.getElementById("username").value,
//
//     };
// }
//
// function clearForm(){
//     document.getElementById("theme").value = "";
//     document.getElementById("status").value = "";
//     document.getElementById("priority").value = "";
//     document.getElementById("comment").value = "";
//     document.getElementById("username").value = "";
// }
//


