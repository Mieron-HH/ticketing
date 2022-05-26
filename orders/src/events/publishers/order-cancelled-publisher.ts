import { Subjects, Publisher, OrderCancelledEvent } from "@mhhtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
