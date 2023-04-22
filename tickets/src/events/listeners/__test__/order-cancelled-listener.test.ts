import { OrderCreatedListener } from "../order-creaated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "@ly15001001026/common";
import {Message} from 'node-nats-streaming';
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async() =>{
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString()    
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: "dghfbg"
    })

    ticket.set({orderId})
    await ticket.save();

    const data: OrderCancelledEvent['data']= {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    //@ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }
    return { listener, ticket , data,msg,orderId}
}

it('updates th eticket , publish an event and acks the message' , async ()=>{
  
    const { listener, ticket , data,msg,orderId} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket  = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();

})