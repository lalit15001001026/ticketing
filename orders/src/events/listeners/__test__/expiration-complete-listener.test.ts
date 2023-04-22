import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "../../../models/order";
import { Message} from 'node-nats-streaming'
import { ExpirationCompleteEvent } from "@ly15001001026/common";
const setup = async ()=>{
    const listener =  new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString() ,
        title: 'concert',
        price: 20
});
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "sbkg",
        expiresAt: new Date(),
        ticket
    })

    await order.save();

    const data: ExpirationCompleteEvent['data'] ={
        orderId: order.id
    }
//@ts-ignore
    const msg: Message ={
        ack: jest.fn()
    }

    return { listener, order,ticket,data,msg}
}

it("update sthe orde status to canceller",async ()=>{
    
    const { listener, order,ticket,data,msg} = await setup()
    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id);
expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it("emit the order cancelled event",async ()=>{

    const { listener, order,ticket,data,msg} = await setup()
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it("ack the message",async ()=>{

    const { listener, order,ticket,data,msg} = await setup()
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})