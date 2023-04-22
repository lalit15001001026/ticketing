import { Publisher, Subjects, OrderCreatedEvent } from "@ly15001001026/common";

export class OrderCreatedPublisher extends Publisher < OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}