import { Publisher, OrderCancelledEvent, Subjects } from "@mhhtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
