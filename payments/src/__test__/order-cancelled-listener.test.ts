import { natsWrapper } from "../nats-wrapper"
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";
import { Order } from "../models/order";
import { OrderCancelledEvent, OrderStatus } from "@ly15001001026/common";
import mongoose from "mongoose";
import { Message} from 'node-nats-streaming'

const setup = async ()=>{
    const listener = new OrderCancelledListener(natsWrapper.client);


    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: "dfjd",
        version: 0
    })

    
    await order.save();
    console.log(order)
    const data: OrderCancelledEvent['data'] ={
        id: order.id,
        version: 1,
        ticket: {
            id:"jibv"
        }

    }

    //@ts-ignore
    const msg: Message ={
        ack: jest.fn()
    }

    return { data,listener,msg}
}

it('updates te status of order', async ()=>{
    const { data,listener,msg} = await setup();
    await listener.onMessage(data,msg);
    const order= await Order.findById(data.id);
    expect(order!.status).toEqual(OrderStatus.Cancelled)


})

it('acks the message', async ()=>{
    const { data,listener,msg} = await setup();
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled();
    
})