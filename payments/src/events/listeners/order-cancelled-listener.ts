import { Listener,OrderCancelledEvent, Subjects ,OrderStatus} from "@ly15001001026/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class OrderCancelledListener extends Listener <OrderCancelledEvent>{
    queueGroupName = queueGroupName;
    subject :Subjects.OrderCancelled = Subjects.OrderCancelled;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message)
    {
        console.log(data)
        const order = await Order.findOne({
            _id: data.id
        ,version: data.version -1 });
        if(!order)
        throw new Error("Order not found")
        order.set({status: OrderStatus.Cancelled})
        await order.save();

        msg.ack();
    }

}