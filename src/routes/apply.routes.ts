import { Router } from "express";
import applyController from "../controllers/apply.controller";
import { validateObjectId } from "../middleware/validateObjectId";

const router = Router();

router.post("/", validateObjectId, applyController.apply);

export default router;
