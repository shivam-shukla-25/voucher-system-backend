import { Request, Response } from "express";
import { createOrderSchema } from "../validators/order.validator";
import orderService from "../services/order.service";

class OrderController {
  async create(req: Request, res: Response) {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    try {
      const order = await orderService.createOrder(parsed.data);
      return res.status(201).json(order);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  async get(req: Request, res: Response) {
    const order = await orderService.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  }

  async list(req: Request, res: Response) {
    const orders = await orderService.listOrders();
    return res.json(orders);
  }
}

export default new OrderController();
