import request from "supertest";
import { app } from "../../app";


it('resposne with details of the current user' , async()=>{
    const cookie = await signin();
    const response = await request(app).
    get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test123@test.com')
})

it('resposne with null if not authenticated' , async()=>{
    const cookie = await signin();
    const response = await request(app).
    get('/api/users/currentuser')
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null)
})