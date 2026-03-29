CREATE TABLE IF NOT EXISTS Users(
    id TEXT PRIMARY KEY,
    userFullName TEXT NOT NULL,
    userEmail TEXT NOT NULL UNIQUE,
    userCourse INTEGER NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Tickets(
    id TEXT PRIMARY KEY,
    theme TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    comment TEXT NOT NULL,
    username TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Messages(
    id TEXT PRIMARY KEY,
    ticketId TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (ticketId) REFERENCES Tickets (id) ON DELETE CASCADE
);