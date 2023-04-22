import { Subjects, Publisher, OrderCancelledEvent } from "@ly15001001026/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {

    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}

