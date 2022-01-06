import type {Trade,User,Stock} from '../types/types'

interface Idb {
    getTrades() : Trade[] | undefined
    deleteTrades() : boolean
    addTrade(trade:Trade) : boolean
    getTradeByUserID(userId: number) : Trade[] | undefined
    getStockPricesByDateRange(stockSymbol:string,start:Date,end:Date) : Stock | undefined
    getTradesBySymbol(stockSymbol:string) : Trade[] | undefined
}

export {Idb}