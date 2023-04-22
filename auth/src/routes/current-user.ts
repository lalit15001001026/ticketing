import express from 'express'
import { currentUser } from '@ly15001001026/common'

const router = express.Router()

router.get('/api/users/currentuser',currentUser,(req,res)=>{

    res.send({ currentUser: req.currentUser || null})


    
    
});

export  { router as currentUserRouter };