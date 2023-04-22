import { Publisher,Subjects,TicketUpdatedEvent } from "@ly15001001026/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{


    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;

}

