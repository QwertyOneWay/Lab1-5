const createForm = document.getElementById('createForm');
const resetBtn = document.getElementById('resetBtn');
const tbody = document.getElementById('itemstablebody');

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