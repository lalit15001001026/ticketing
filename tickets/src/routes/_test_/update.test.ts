import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';
it("return 404 if the provided id doesnot exists", async ()=>{

    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie",signin())
    .send({
        title:'fbjk',
        price: 20
    })
    .expect(404);
})

it("return 401 if user is not authentictaed", async ()=>{

    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title:'fbjk',
        price: 20
    })
    .expect(401);
})

it("return 401 if the users does not own the ticket", async ()=>{

    const resposne = await request(app)
    .post('/api/tickets')
    .set("Cookie",signin())
    .send({
        title:"dfgdh",
        price: 20
    });

    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',signin())
    .send({
        title:"dfgdh",
        price: 20
    }).expect(401)
})

it("return 400 if the user provides an invalid title and price", async ()=>{

    const cookie = signin()
    const resposne = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"dfgdh",
        price: 20
    });

    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:"",
        price: 40
    }).expect(400)

    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:"jgbjkg",
        price: -40
    }).expect(400)

})

it("updates the ticket if the user provides valid detail", async ()=>{

    const cookie = signin()
    const resposne = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"dfgdh",
        price: 20
    });

    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:"checking update",
        price: 100
    }).expect(200)
    const ticketResponse = await request(app)
            .get(`/api/tickets/${resposne.body.id}`)
            .send();
    expect(ticketResponse.body.title).toEqual('checking update')
    expect(ticketResponse.body.price).toEqual(100)    



})

it("publish an event" ,async ()=>{
    const cookie = signin()
    const resposne = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"dfgdh",
        price: 20
    });

    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:"checking update",
        price: 100
    }).expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})

it("rejects update if ticket is reserved" , async()=>{

    const cookie = signin()
    const resposne = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"dfgdh",
        price: 20
    });

    const ticket = await Ticket.findById(resposne.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString()});

    await ticket!.save();


    await request(app)
    .put(`/api/tickets/${resposne.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:"checking update",
        price: 100
    }).expect(400)


})