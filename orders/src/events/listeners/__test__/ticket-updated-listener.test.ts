import { TickerUpdatedListener } from "../ticket-updated-litener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from "@ly15001001026/common"
import { Ticket } from "../../../models/ticket"
import mongoose from "mongoose";
import { Message } from 'node-nats-streaming';
import { OperationCanceledException } from "typescript";

const setup = async() =>{

    const listener = new TickerUpdatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20      
    })

    await ticket.save();

    const data : TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        version: ticket.version+1,
        price: 999,
        userId:'bfis'
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()

    }

    return { msg, data ,ticket,listener}

}

it("finds, updates and saves a ticket", async() =>{
    const { msg, data ,ticket,listener} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);



})

it("acks the message", async()=>{

    const { msg, data ,ticket,listener} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})

it('doesnt call ack if out of order', async() =>{
    const { msg, data ,ticket,listener} = await setup();
    data.version = 10;
    try 
    {
    await listener.onMessage(data,msg);
    }
    catch (err){
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
    

})