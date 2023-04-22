import express, { Request , Response} from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validationRequest } from '@ly15001001026/common';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders', requireAuth,[
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId musst be provided')
], validationRequest, async(req: Request, res:Response)=>{

    const { ticketId} = req.body;

    
    // Find th ticket the user is trying to order in the databsase
    const ticket = await Ticket.findById(ticketId)
    console.log(ticket)
    if(!ticket)
    {
        throw new NotFoundError();
    }

    // Make sure tickete is not aready reserved
    const isReserved = await ticket.isReserved();
    console.log("reserved value", isReserved)
    if(isReserved)
    {
        throw new BadRequestError("Ticket is already reserved")
    }
    // Calculate the expiration date for this order

    console.log("reacher till here")
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // BUild the order and save it to database

    const order = Order.build({
        userId : req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });


    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status:  order.status,
        expiresAt : order.expiresAt.toISOString(),
        userId: order.userId,
        version: order.version,
        ticket:{
            id: ticket.id,
            price: ticket.price
        }
    })



    // Publish an vent saying that an event is created
    res.status(201).send(order);
})

export { router as newOrderRouter}