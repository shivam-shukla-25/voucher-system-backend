import { Router } from "express";
import voucherController from "../controllers/voucher.controller";

const router = Router();

router.post("/", voucherController.create);
router.get("/", voucherController.getAll);
router.get("/:code", voucherController.getByCode);
router.put("/:code", voucherController.update);
router.delete("/:code", voucherController.delete);

export default router;
