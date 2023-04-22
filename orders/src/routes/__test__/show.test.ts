import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
it("fetches the order" , async() =>{

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

    const {body: fetchOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200)

    expect(fetchOrder.id).toEqual(order.id);

})



it("returns an error if user try to access other dtaa" , async() =>{

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

    const {body: fetchOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signin())
    .send()
    .expect(401)

    
})