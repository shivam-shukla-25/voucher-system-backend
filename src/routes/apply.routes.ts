import { Router } from "express";
import applyController from "../controllers/apply.controller";
import { validateOrderId } from "../middleware/validateOrderId";

const router = Router();

router.post("/", validateOrderId, applyController.apply);

export default router;
