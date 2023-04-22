import { Publisher,Subjects,TicketCreatedEvent } from "@ly15001001026/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{


    subject : Subjects.TicketCreated = Subjects.TicketCreated;
    
}