import { Router } from "express";
import * as ticketsController from "../controllers/tickets.controller";
import {
  validateCreateTicket,
  validateUpdateTicket,
} from "../middlewares/validation";

const router = Router();

router.get("/advanced/stats", ticketsController.getTicketsStats);
router.get("/advanced/with-messages", ticketsController.getTicketsWithMessages);
router.get("/advanced/top-bugs", ticketsController.getTopBugs);
router.get("/advanced/search", ticketsController.searchTicketsVulnerable);

router.get("/:id", ticketsController.getTicketById);
router.get("/", ticketsController.getAllTickets);
router.post("/", validateCreateTicket, ticketsController.createTicket);
router.delete("/:id", ticketsController.deleteTicket);
router.put("/:id", validateUpdateTicket, ticketsController.updateTicket);

export default router;
