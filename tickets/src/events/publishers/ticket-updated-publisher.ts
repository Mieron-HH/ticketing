import { Publisher, Subjects, TicketUpdatedEvent } from "@mhhtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
