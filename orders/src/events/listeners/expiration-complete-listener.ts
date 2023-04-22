import { Listener ,Subjects,ExpirationCompleteEvent} from "@ly15001001026/common";
import { Message } from 'node-nats-streaming'
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderStatus } from "@ly15001001026/common";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {

    queueGroupName = queueGroupName;
    subject:  Subjects.ExpirationComplete =  Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order)
        throw new Error('Order not  found')

        order.set({
            status: OrderStatus.Cancelled,
            
        })
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();



    }

}