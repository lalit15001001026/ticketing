import { Message} from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@ly15001001026/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TickerUpdatedListener extends  Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

        const ticket = await Ticket.findByEvent(data);
        
        const {title,price}= data
        if(!ticket)
        {
            throw new Error('Tcket not found')
        }

        ticket.set({title,price})
        await ticket.save();

        msg.ack();

    }
}