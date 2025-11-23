import { Router } from "express";
import orderController from "../controllers/order.controller";
import { validateObjectId } from "../middleware/validateObjectId";

const router = Router();

router.post("/", orderController.create);
router.get("/", orderController.list);
router.get("/:id", validateObjectId, orderController.get);

export default router;
