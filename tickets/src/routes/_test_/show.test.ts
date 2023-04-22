import { response } from "express";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if the ticket is not found" , async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()

    console.log(response.body)
})

it("return a 200 if the ticket is found" , async()=>{

    const title="concert";
    const price = 20;
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
        title,price
    })
    .expect(201)

    const tickerResponse= await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
    expect(tickerResponse.body.title).toEqual(title);
    expect(tickerResponse.body.price).toEqual(price);

})