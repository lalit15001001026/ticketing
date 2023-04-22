import express, { Request , Response} from 'express';
import { NotAuthorizederror, NotFoundError, requireAuth } from '@ly15001001026/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth , async(req: Request, res:Response)=>{
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if(!order)
    throw new NotFoundError();

    if(order.userId != req.currentUser!.id)
    throw new NotAuthorizederror();


    res.send(order);
})

export { router as showOrderRouter}