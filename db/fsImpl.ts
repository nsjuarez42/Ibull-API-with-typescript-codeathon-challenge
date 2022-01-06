import { Stock, Trade, Database} from "../types/types";
import { Idb } from "./Idb";
const fs = require("fs")

const PATH = "./data/data.json"

class fsImpl implements Idb {
    constructor(){
        
    }

    private readDatabase() : Database{
     const data = fs.readFileSync(PATH)
     const database : Database = JSON.parse(data)
     return database
    }

    private writeDatabase(data:any) : boolean{
     try {
       fs.writeFileSync(PATH,JSON.stringify(data))
       return true
         
     } catch (error) {
         console.log(error)
         return false
     }
    }

    getTrades(): Trade[] | undefined {
    const db :Database = this.readDatabase()
     
    return db.trades
    }

    deleteTrades(): boolean {
        const db: Database = this.readDatabase()
        
        if(db.trades.length == 0) return true
          
        const emptyDb = {
            trades:[]
        }

        return this.writeDatabase(emptyDb)


    }

    addTrade(trade: Trade) : boolean {
        const db : Database = this.readDatabase()

        db.trades.push(trade)

        return this.writeDatabase(db)

    }

    getTradeByUserID(userId: number): Trade[] | undefined{
        const db:Database = this.readDatabase()
        
        if(db.trades.length == 0) return undefined


        const userTrades : Trade[]= db.trades.filter(el=>el.user.id == userId)

        if(userTrades.length == 0) return undefined

        return userTrades
    
    }

    //find highest and lowest stock price
    //by date range

    getStockPricesByDateRange(stockSymbol: string,start:Date,end:Date): Stock | undefined {
      const db:Database = this.readDatabase()

      if(db.trades.length == 0) return undefined

      const stocksBySymbol = db.trades.filter(el=>el.symbol == stockSymbol)

      if(stocksBySymbol.length ==0) return undefined

      const sortedStockByPrice = stocksBySymbol.sort((a:Trade,b:Trade)=>{
        const {price:aPrice} = a
        const {price:bPrice} = b
        if(aPrice < bPrice) return -1

        if(aPrice>bPrice) return 1

        return 0

      })

      console.log(sortedStockByPrice)

      const symbol = stocksBySymbol[0].symbol
      const stock : Stock = {
         symbol,
         highest:stocksBySymbol[0].price,
         lowest:sortedStockByPrice[sortedStockByPrice.length -1].price
      }

      return stock
    }

    getTradesBySymbol(stockSymbol: string): Trade[] | undefined {
        const db:Database = this.readDatabase()

        if(db.trades.length == 0) return undefined

        const tradesBySymbol = db.trades.filter(el=>el.symbol == stockSymbol)

        if(tradesBySymbol.length ==0) return undefined

        return tradesBySymbol
    }

    

}

export {fsImpl}