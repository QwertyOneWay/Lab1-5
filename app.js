const theme1 = document.getElementById('theme');
const status1 = document.getElementById('status');
const priority1 = document.getElementById('priority');
const comment1 = document.getElementById('comment');
const username1 = document.getElementById('username');
const createForm = document.getElementById('createForm');
const resetBtn = document.getElementById('resetBtn');
const tbody = document.getElementById('itemstablebody');

let items = [];
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
                <button type="button" class="delete-btn" data-id="${item.id}"> Видалити </button>
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
    const newItem = {
        id: Date.now().toString(),
        theme,
        status,
        priority,
        comment,
        username,
    };

    console.log('Новий елемент', newItem);
    items.push(newItem);
    rendertable(items);
    createForm.reset();
});


resetBtn.addEventListener('click', (e) => {
    createForm.reset();
})


tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        console.log('Видаляємо ID рядок:', id, typeof id);
        if (confirm('Видалити цю заявку?')) {
            items = items.filter(item => {
                console.log('Порівнюємо:', item.id, typeof item.id, 'з', id, typeof id);
                return item.id !== id
            });
            console.log('Масив після видалення:', items);
            rendertable(items);
        }
    }
});

rendertable(items);


