INSERT OR IGNORE INTO Users (id, userFullName, userEmail, userCourse, createdAt)
    VALUES ('user-1', 'Адмін', 'admin@edu.ua', 4, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO Tickets (id, theme, status, priority, comment, username, createdAt)
    VALUES ('ticket-1', 'Проблема з принтером', 'Bug', 'high', 'Не друкує', 'Адмін', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO Messages (id, ticketId, text, author, createdAt)
    VALUES ('msg-1', 'ticket-1', 'Вже ремонтуємо!', 'Техпідтримка', CURRENT_TIMESTAMP);
