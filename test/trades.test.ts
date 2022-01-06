import type {Trade} from '../types/types'
const {chai,server,expect,chaiHttp} = require("./uprunning.test")
/*
TODO:
Trades

type checks in response

post
no trade in body

erase
*/



describe("get Trades",function(){
    it("Should return status code 200 and an array of trades or empty",(done)=>{
        chai.request(server)
            .get("/trades")
            .end((err : any ,res : any)=>{
                expect(res).to.have.status(200)
                expect(res.body).to.be.an("array")
                done()
            })
    })
})

describe("get Trades by user id",function(){
   const existentUserId = 1;
   const nonExistentUserId = 5;

   it("should return status 404 when an inexistent user id is given",(done)=>{
       chai.request(server)
           .get(`/trades/users/${nonExistentUserId}`)
           .end((err:any,response:any)=>{
               expect(response).to.have.status(404)
               expect(response.body).to.have.property("description").that.is.eql("Trades for the given user not found")
               done()
           })
   })

   it("should return status 200 and an array of trades ordered by ascending id",(done)=>{
       chai.request(server)
           .get(`/trades/users/${existentUserId}`)
           .end((err:any, response:any)=>{
             expect(response).to.have.status(200)
             expect(response.body).to.be.an("array")
             done()

           })
   })

})

describe("Post trades",function(){
    const correctTrade = {
            "id":3,
            "type":"buy",
            "user":{
                "id":1,
                "name":"nico"
            },
            "symbol":"ACC",
            "shares":15,
            "price":30.4,
            "timestamp":"2012-10-30*02:47:33:899"
    }

    it("should return status 400 if the trade id already exists",(done)=>{
       chai.request(server)
           .post("/trades")
           .set('content-type', 'application/json')
           .send({trade:correctTrade})
           .end((err:any,response:any)=>{
               expect(response).to.have.status(400)
               done()
           })
    })

    it("should return status 400 if the type of trade is invalid",(done)=>{
       let trade = correctTrade
       trade.type= "ddasd"
       trade.id=21
       chai.request(server)
       .post("/trades")
       .set('content-type', 'application/json')
       .send({trade})
       .end((err:any,response:any)=>{
           expect(response).to.have.status(400)
           done()
       })
    })

    it("should return status 400 if the price is out of the accepted range",(done)=>{
        let trade = correctTrade
        trade.id=23
        trade.price =200
        chai.request(server)
        .post("/trades")
        .set('content-type', 'application/json')
        .send({trade})
        .end((err:any,response:any)=>{
            expect(response).to.have.status(400)
            done()
        })
    })
})