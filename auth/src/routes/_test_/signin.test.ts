import request from "supertest";
import { app } from "../../app";

it('fails when a email that does not exists is supplied', async()=>{
    await request(app)
    .post('/api/users/signin')
    .send({
        email:"kjdfkj@gmail.com",
        password: "dkhdkg"
    })
    .expect(400);
})

it('fails when a incorrect password is supplied', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"kjdfkj@gmail.com",
        password: "dkhdkg"
    })

    await request(app)
    .post('/api/users/signin')
    .send({
        email:"kjdfkj@gmail.com",
        password: "dkhdk"
    })
    .expect(400);
})

it('fails when a incorrect password is supplied', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"kjdfkj@gmail.com",
        password: "dkhdkg"
    })
    .expect(201)

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email:"kjdfkj@gmail.com",
        password: "dkhdkg"
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
})