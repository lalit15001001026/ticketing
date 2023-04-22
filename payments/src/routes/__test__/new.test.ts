import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it('returns 404 when purchasing the order that does not exist',async()=>{
    await request(app)
    .post('/api/payments')
    .set('Cookie',global.signin())
    .send({
      token: 'ftdtf',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
})

it('returns 401 when purchasing an order that doesnot belong to user',async()=>{

})