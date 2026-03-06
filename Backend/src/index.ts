import express from "express";
import ticketsRoutes from "./routes/tickets.routes";
import usersRoutes from "./routes/users.routes";

const app = express();
const port = 6060;

app.use(express.json());
app.use('/api/tickets', ticketsRoutes);

app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Отримано запит: ${req.method} ${req.url}`);
    next();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
   console.error('Неочікувана помилка:', err);
   res.status(500).json({error: "Server error"});
});
app.get('/', (req, res) => {
    res.send('Привіт! Сервер працює. Перейди на /api/tickets щоб побачити заявки.');
});

app.listen(port, () => {
    console.log(`🚀 Сервер успішно запущено на http://localhost:${port}`);
    console.log(`Доступні маршрути для заявок: /api/tickets`);
});

app.use('/api/tickets', ticketsRoutes);
app.use('/api/users', usersRoutes);
