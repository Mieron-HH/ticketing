import mongoose from "mongoose";
import { OrderCancelledEvent } from "@mhhtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: "concert",
		price: "30",
		userId: "23982",
	});
	ticket.set({ orderId });
	await ticket.save();

	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, ticket, msg, orderId };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
	const { listener, data, ticket, msg, orderId } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	const publishedTicketData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(publishedTicketData.id).toEqual(data.ticket.id);
});
