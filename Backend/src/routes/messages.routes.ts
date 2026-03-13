import { Router } from "express";
import * as messageController from "../controllers/messages.controller";
import {
  validateCreateMessage,
  validateUpdateMessage,
} from "../middlewares/validation";

const router = Router();

router.get("/:id", messageController.getMessageById);
router.get("/", messageController.getAllMessages);
router.post("/", validateCreateMessage, messageController.createMessage);
router.put("/:id", validateUpdateMessage, messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);

export default router;
