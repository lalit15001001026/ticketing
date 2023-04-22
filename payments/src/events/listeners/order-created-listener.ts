import { Listener,OrderCreatedEvent, Subjects } from "@ly15001001026/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener <OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject :Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message)
    {
        const order = await Order.build ({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        msg.ack();
    }

}