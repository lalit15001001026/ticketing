import { OrderCreatedListener } from "../order-creaated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@ly15001001026/common";
import {Message} from 'node-nats-streaming';
import mongoose from "mongoose";
import { isAwaitExpression } from "typescript";

const setup = async() =>{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: "dghfbg"
    })

    await ticket.save();

    const data: OrderCreatedEvent['data']= {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "rey54y4",
        version: 0,
        expiresAt: '454545e',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    //@ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }
    return { listener, ticket , data,msg}
}

it("sets the orderId of the ticket", async() =>{
    const { listener, ticket , data,msg}= await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id)


}
)

it("it acks the message", async() =>{
    const { listener, ticket , data,msg}= await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()

})

it("publishes a ticket updated event" , async() =>{

    const { listener, ticket , data,msg}= await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})