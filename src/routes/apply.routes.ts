import { Router } from "express";
import applyController from "../controllers/apply.controller";

const router = Router();

router.post("/", applyController.apply);

export default router;
