import express from "express";
import cors from "cors";
import ticketsRoutes from "./routes/tickets.routes";
import usersRoutes from "./routes/users.routes";
import messagesRoutes from "./routes/messages.routes";
import { requestLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const port = 6060;

app.use(cors());
app.use(express.json());

//logger
app.use(requestLogger);

//routes
app.use("/api/tickets", ticketsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

//obrobnik pomylok
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(
    "Привіт! Сервер працює. Перейди на /api/tickets щоб побачити заявки /api/messages для повідомлень та /api/users для користувачів.",
  );
});

app.listen(port, () => {
  console.log(`Сервер успішно запущено на http://localhost:${port}`);
  console.log(`Доступні маршрути для заявок: /api/tickets /api/users /api/messages`);
});
