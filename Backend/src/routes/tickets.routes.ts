import {Router} from "express";
import * as ticketsController from '../controllers/tickets.controller';

const router = Router();

router.get('/:id', ticketsController.getTicketById);
router.get('/', ticketsController.getAllTickets);
router.post('/', ticketsController.createTicket);
router.delete('/:id', ticketsController.deleteTicket);
router.put('/:id', ticketsController.updateTicket);

export default router;