import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from "@mhhtickets/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
			throw new BadRequestError("Invalid order ID");
		}

		const order = await Order.findById(req.params.orderId).populate("ticket");

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		// Publishing an event saying the order was cancelled
		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.send(order);
	}
);

export { router as deleteOrderRouter };
