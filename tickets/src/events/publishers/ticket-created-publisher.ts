import { Publisher, Subjects, TicketCreatedEvent } from "@mhhtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
