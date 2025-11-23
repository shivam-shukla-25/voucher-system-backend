import { Router } from "express";
import promotionController from "../controllers/promotion.controller";

const router = Router();

router.post("/", promotionController.create);
router.get("/", promotionController.getAll);
router.get("/:code", promotionController.getByCode);
router.put("/:code", promotionController.update);
router.delete("/:code", promotionController.delete);

export default router;
