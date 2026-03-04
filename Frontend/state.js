let items = JSON.parse(localStorage.getItem("items")) || [];
let editingId = null;
function saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
}