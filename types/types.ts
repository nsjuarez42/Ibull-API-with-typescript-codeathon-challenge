type User = {
    id:number,
    name:string
}

type Stock = {
    symbol:string,
    highest:number,
    lowest:number
}

type Trade = {
    id:number,
    type:string,
    user:User,
    symbol:string,
    shares:number,
    price:number,
    timestamp:string
}

type Database = {
    trades: Trade[]
}

export type {User,Trade,Stock,Database}