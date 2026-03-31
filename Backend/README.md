# Лабораторна робота №3: Техпідтримка Студентів (SQLite)

## Як запустити проєкт та ініціалізувати базу
1. Встановіть залежності: `npm install`
2. Запустіть сервер: `npm run dev`
3. **Ініціалізація БД:** Відбувається автоматично при запуску сервера (функція `migrate()`). Файл бази даних створюється локально за шляхом `./data/app.db`.

## Опис схеми бази даних
Схема складається з 3 таблиць, які пов'язані між собою.

### 1. Таблиця `Users` (Користувачі)
* `id` (TEXT, PRIMARY KEY) - Унікальний ідентифікатор.
* `userFullName` (TEXT, NOT NULL) - ПІБ студента.
* `userEmail` (TEXT, NOT NULL, **UNIQUE**) - Пошта (не може повторюватися).
* `userCourse` (INTEGER, NOT NULL) - Курс.
* `createdAt` (TEXT, NOT NULL)

### 2. Таблиця `Tickets` (Заявки)
* `id` (TEXT, PRIMARY KEY)
* `theme` (TEXT, NOT NULL) - Тема заявки.
* `status` (TEXT, NOT NULL) - Статус (Bug, Question, Blocker, offer).
* `priority` (TEXT, NOT NULL) - Пріоритет.
* `comment` (TEXT, NOT NULL)
* `username` (TEXT, NOT NULL)
* `createdAt` (TEXT, NOT NULL)

### 3. Таблиця `Messages` (Повідомлення до заявок)
* `id` (TEXT, PRIMARY KEY)
* `ticketId` (TEXT, NOT NULL) - **FOREIGN KEY**, посилається на `Tickets(id)`. Встановлено правило **ON DELETE CASCADE** (при видаленні заявки автоматично видаляються всі пов'язані повідомлення базою даних).
* `text` (TEXT, NOT NULL)
* `author` (TEXT, NOT NULL)
* `createdAt` (TEXT, NOT NULL)

## Демонстрація SQL-ін'єкції 
У проєкті реалізовано спеціально вразливий ендпойнт для пошуку заявок:
`GET /api/tickets/advanced/search?q=...`

У репозиторії запит формується через небезпечну рядкову конкатенацію:
`SELECT * FROM Tickets WHERE theme LIKE '%${themeQuery}%';`

**Чому це небезпечно:**
Якщо користувач передасть у параметр `q` спеціально сформований рядок, наприклад:
`' OR 1=1 --`
Запит перетвориться на:
`SELECT * FROM Tickets WHERE theme LIKE '%' OR 1=1 --%';`
Це повністю ламає логіку фільтрації. Оскільки умова `1=1` завжди істинна, база даних проігнорує пошук і поверне зловмиснику **абсолютно всі** заявки. Коментар `--` просто відкине залишок оригінального запиту.