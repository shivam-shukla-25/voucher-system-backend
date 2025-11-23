import { Router } from "express";
import orderController from "../controllers/order.controller";
import { validateParamObjectId } from "../middleware/validateParamObjectId";

const router = Router();

router.post("/", orderController.create);
router.get("/", orderController.list);
router.get("/:id", validateParamObjectId, orderController.get);

export default router;
