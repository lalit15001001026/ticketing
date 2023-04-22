import nats  from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListene } from './events/ticket_created-listener';


console.clear();
const stan = nats.connect("ticketing",randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
})

stan.on('connect',()=>{
    console.log("listener connected to nats");

    stan.on('close',()=>{
        console.log("NATS closed");
        process.exit()
    })
    
    
    new TicketCreatedListene (stan).listen();

})



