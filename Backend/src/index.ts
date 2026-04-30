import express from "express";
import cors from "cors";
import ticketsRoutes from "./routes/tickets.routes";
import usersRoutes from "./routes/users.routes";
import messagesRoutes from "./routes/messages.routes";
import { requestLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { migrate } from "./db/migrate";

const app = express();
const port = 6060;


const corsOptions = {
  origin: "http://localhost:63342",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

//logger
app.use(requestLogger);

//routes
app.use("/api/v1/tickets", ticketsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/messages", messagesRoutes);

//obrobnik pomylok
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(
    "Привіт! Сервер працює. Перейди на /api/tickets щоб побачити заявки /api/messages для повідомлень та /api/users для користувачів.",
  );
});

async function bootstrap() {
  try {
    await migrate();

    app.listen(port, () => {
      console.log(`Сервер успішно запущено на http://localhost:${port}`);
      console.log(`Доступні маршрути для заявок: /api/tickets /api/users /api/messages`);
    });
  } catch (error) {
    console.error("Server Error", error);
    process.exit(1);
  }
}

bootstrap();


