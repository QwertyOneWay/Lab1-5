import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../middlewares/validation";

const router = Router();

router.get("/:id", usersController.getUserById);
router.get("/", usersController.getAllUsers);
router.post("/", validateCreateUser, usersController.createUser);
router.put("/:id", validateUpdateUser, usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
