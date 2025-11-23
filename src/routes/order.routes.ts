import { Router } from "express";
import orderController from "../controllers/order.controller";

const router = Router();

router.post("/", orderController.create);
router.get("/", orderController.list);
router.get("/:id", orderController.get);

export default router;
