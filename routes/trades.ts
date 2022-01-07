
import {Request,Response} from 'express'
import {fsImpl as Database} from '../db/fsImpl'
import type {Trade} from '../types/types'
//export {}
let express = require('express');
let router = express.Router();

const MINIMUM_PRICE = 130.42

const MAXIMUM_PRICE =195.65

const TRADE_TYPES = {
    BUY:"buy",
    SELL:"sell"
}

// Routes related to trades
function sortTradesByAscendingId(trades: Trade[]) : Trade[] {
    return trades.sort((a:Trade,b:Trade)=>{
        const {id:aId} = a;
        const {id:bId} = b;
 
        if(aId < bId) return -1
 
        if(aId > bId) return 1
 
        return 0
 
 
       })
}

router.post("/",(req :Request ,res : Response)=>{
  
   try {
    const db = new Database()
   
    const trades : Trade[] | undefined = db.getTrades()

    if(trades == undefined){
        res.status(400).send({description:"no data in db"})
        throw new Error("no data in db")
    } 

    if(!req.body.trade){
        res.status(400).send({description:"Trade not sent"})
        throw new Error("trade not sent")
    } 

    const {trade} = req.body

    if(trades.find(el=>el.id == trade.id)){
        res.status(400).send({description:"There is already a trade with id"})
        throw new Error("There is already a trade with that id")
    } 

    const {shares} = trade
    if(shares >30 || shares <10 ){
        res.status(400).send({description:"shares values are out of range"})
        throw new Error("share values are out of range")
    } 

    

    const {price} = trade
    if(price < MINIMUM_PRICE || price > MAXIMUM_PRICE){
     res.status(400).send({description:"price out of accepted range"})
     throw new Error("price out of accepted range")
    }

    const {type : tradeType} = trade

    if(tradeType == TRADE_TYPES.BUY || tradeType == TRADE_TYPES.SELL){
        
            if(!db.addTrade(trade)) {
                res.status(400).send({description:"error adding trade"})
                throw new Error("error adding trade")
            }
            
            res.status(201).send({description:"Trade has been storaged correctly"})
        
   
    }else{
        res.status(400).send({description:"trade type not valid"})
        throw new Error("trade type not valid")
    } 

   } catch (error) {
       console.log(error)
   }
   

})

router.get("/",(req:Request,res:Response)=>{
  const db = new Database()

  const trades = db.getTrades()
     
  
  if(trades !== undefined){
      const tradesByAscendingId = sortTradesByAscendingId(trades)
    res.status(200).send(tradesByAscendingId)
  } 

})

router.get("/users/:id",(req:Request,res:Response)=>{
  try {
      if(!req.params.id){
        res.status(400).send({description:"user id not sent"})
        throw new Error("user id not sent")
      } 
      const userId = parseInt(req.params.id)

      const db = new Database()

      const trades : Trade[] | undefined = db.getTradeByUserID(userId)

      if(!trades){
        res.status(404).send({description:"Trades for the given user not found"})
        throw new Error("Trades for the given user not found")
      }else{
        const tradesByAscendingId = sortTradesByAscendingId(trades)
        res.status(200).send(tradesByAscendingId)
      }

  } catch (error) {
      console.log(error)
  }
})


module.exports = router;