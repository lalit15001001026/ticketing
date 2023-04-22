import { natsWrapper } from "../nats-wrapper"
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { Order } from "../models/order";
import { OrderCreatedEvent, OrderStatus } from "@ly15001001026/common";
import mongoose from "mongoose";
import { Message} from 'node-nats-streaming'

const setup = async ()=>{
    const listener = new OrderCreatedListener(natsWrapper.client);


    const data: OrderCreatedEvent['data'] ={
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: "sdkbuh",
        expiresAt:"dfjdij",
        status: OrderStatus.Created,
        ticket: {
            id:"jibv",
            price: 10
        }

    }

    //@ts-ignore
    const msg: Message ={
        ack: jest.fn()
    }

    return { data,listener,msg}
}

it('replicates the order info', async ()=>{
    const { data,listener,msg} = await setup();
    await listener.onMessage(data,msg);
    const order= await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price)


})

it('acks the message', async ()=>{
    const { data,listener,msg} = await setup();
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled();
    
})