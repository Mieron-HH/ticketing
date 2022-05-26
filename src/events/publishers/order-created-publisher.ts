import { Publisher, OrderCreatedEvent, Subjects } from "@mhhtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
