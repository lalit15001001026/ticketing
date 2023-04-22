import express  , { Request, Response} from 'express';
import { body } from 'express-validator';
import{
    requireAuth,
    validationRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizederror,
    OrderStatus
} from '@ly15001001026/common';

import { Order } from '../models/order';

const router =express.Router();

router.post('/api/payments',
requireAuth,
[
    body('token').
    not()
    .isEmpty(),
    body('orderId').
    not()
    .isEmpty()
]
,validationRequest,
async (req: Request, res: Response)=>{

const { token, orderId } = req.body;

const order = await Order.findById(orderId);
if(!order)
{
    throw new NotFoundError();
}

if(order.userId ! = req.currentUser!.id)
throw new NotAuthorizederror();

if(order.status==OrderStatus.Cancelled)
throw new BadRequestError('Cannot pay for an cancelled order')



})

export { router as createChargeRouter};