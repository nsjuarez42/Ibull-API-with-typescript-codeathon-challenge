export {}
import { Request,Response } from "express";
import { fsImpl as Database } from "../db/fsImpl";
import { Trade,Stock } from "../types/types";
var express = require('express');
var router = express.Router();


// Routes related to stocks
/*
TODO:
deal with wrong date format or no date

*/

router.get("/:symbol/price",(req:Request,res:Response)=>{

try {
    if(!req.params.symbol || !req.query.start || !req.query.end){
     
     throw new Error("malformed expected data")
    }

    const {symbol} = req.params;
    const {start,end}  = req.query

    if(typeof start == "string" && typeof end == "string"){
        const startDate : Date  = new Date(start)
        const endDate :Date = new Date(end)


        console.log(startDate,endDate)

        const db = new Database()
        
        const tradesBySymbol =  db.getTradesBySymbol(symbol)

        if(!tradesBySymbol){
            res.status(204).send({description:"there are no trades for the given stock symbol"})
            throw new Error("there are no trades for the given stock symbol")
        }

        const tradesInDateRange = tradesBySymbol.filter(el=>new Date(el.timestamp) >= startDate && new Date(el.timestamp) <= endDate  )

        if(tradesInDateRange.length == 0){
            res.status(404).send({description:"There are no trades for the given date range"})
            throw new Error("There are no trades for the given date range")
        }

        const sortedTradesByPrice = tradesInDateRange.sort((a:Trade,b:Trade)=>{
            const {price:aPrice} = a
            const {price:bPrice} = b

            if(aPrice < bPrice) return -1

            if(aPrice>bPrice) return 1
    
            return 0
        })

        console.log(sortedTradesByPrice)

        const stock : Stock ={
            symbol,
            highest:sortedTradesByPrice[sortedTradesByPrice.length-1].price,
            lowest:sortedTradesByPrice[0].price
        }

        res.status(200).send(stock)

    }else{

        throw new Error("malformed expected data")
    }
    
    
    
} catch (error) {
    console.log(error)
}

})

module.exports = router;