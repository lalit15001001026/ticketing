import  request  from "supertest";
import { app } from "../../app";

const createTicket =()=>{
    return request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
        title:'gjgj',
        price: 20
    });
}
it("can fetch a ist of ticket" , async()=>{
    await createTicket();
    await createTicket();
    await createTicket();
    

    const response = await request(app)
            .get('/api/tickets')
            .send()
            .expect(200);
    expect(response.body.length).toEqual(3);

});