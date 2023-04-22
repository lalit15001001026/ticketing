import {Message} from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@ly15001001026/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener< TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName

    async onMessage( data: TicketCreatedEvent['data'], msg: Message) {
        const { id,title, price } = data;
        console.log("reached till here1",title)
        const ticket = Ticket.build({
            title,price,id
        });
        console.log("reached till here2")

        await ticket.save();
        console.log("reached till here3")
        msg.ack();



    }
}