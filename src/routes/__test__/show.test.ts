import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signup } from "../../test/authHelper";

it("fetches the order", async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: "30",
	});
	await ticket.save();

	const user = signup();
	// make a request to build an order with ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id });

	// make a request to fetch the order
	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: "30",
	});
	await ticket.save();

	const user = signup();
	// make a request to build an order with ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id });

	// make a request to fetch the order
	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", signup())
		.expect(401);
});
