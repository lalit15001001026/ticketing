import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it("mmarked the order as cancelled ", async () =>{

    const ticket = Ticket.build({
        title:'conncert',
        price: 30,
        id:new mongoose.Types.ObjectId().toHexString()
    });

    ticket.save();
    const user = signin();

    const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({
        ticketId: ticket.id
    })
    .expect(201)

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie",user)
    .send()
    .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)



})

it("emits an event to NATS" , async()=>{
    const ticket = Ticket.build({
        title:'conncert',
        price: 30,
        id:new mongoose.Types.ObjectId().toHexString()
    });

    ticket.save();
    const user = signin();

    const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({
        ticketId: ticket.id
    })
    .expect(201)

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie",user)
    .send()
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})