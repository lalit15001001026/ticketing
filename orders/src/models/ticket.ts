import mongoose from "mongoose";
import { Order , OrderStatus} from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAttrs {

    title: string;
    price: number;
    id: string;
}

export interface TicketDoc extends mongoose.Document {

    title: string;
    price: number;
    version: number;
    isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: String, version: number}) : Promise <TicketDoc | null>;

}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:0
    }
},
{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        },
    }
});

ticketSchema.statics.findByEvent = (event: { id: string, version:number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version-1
    })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    console.log("reached in build ", attrs)
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    })
}


ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.methods.isReserved = async function () {
    const  existingOrder =await  Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    // console.log(existingOrder.ticket)

    return !!existingOrder;
}

const Ticket = mongoose.model< TicketDoc,TicketModel> ('Ticket', ticketSchema)

export { Ticket }