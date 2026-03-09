let items = [];
let editingId = null;

function saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
}

function getActiveUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

function saveActiveUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function clearActiveUser() {
    localStorage.removeItem('currentUser');
}