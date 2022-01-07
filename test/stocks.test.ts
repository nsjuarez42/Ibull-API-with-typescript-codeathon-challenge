import type {Stock} from '../types/types'
const {chai,server,expect} = require("./uprunning.test")


describe("Get prices in date range",function(){

 const INCORRECT_STOCK_SYMBOL = "sdada"
 const STOCK_SYMBOL = "ACC"
 const START_DATE = "2010-10-30*02:47:33:899"
 const END_DATE = "2017-10-30*02:47:33:899"
const OUT_OF_RANGE_DATES ={
    START:"2019-10-30*02:47:33:899",
    END:"2020-10-30*02:47:33:899"
}


     it("should return status 204 if the stock symbol is not existent",(done)=>{
         chai.request(server)
              .get(`/stocks/${INCORRECT_STOCK_SYMBOL}/price?start=${START_DATE}&end=${END_DATE}`)
              .end((err:any,response:any)=>{
                  expect(response).to.have.status(204)
                  done()
              })
     })

     it("should return status 404 if there are no trades between the date range",(done)=>{
        chai.request(server)
        .get(`/stocks/${STOCK_SYMBOL}/price?start=${OUT_OF_RANGE_DATES.START}&end=${OUT_OF_RANGE_DATES.END}`)
        .end((err:any,response:any)=>{
            expect(response).to.have.status(404)
            done()
        })
     })

     it("should return status 200 and a stock",(done)=>{
        chai.request(server)
        .get(`/stocks/${STOCK_SYMBOL}/price?start=${START_DATE}&end=${END_DATE}`)
        .end((err:any,response:any)=>{
            expect(response).to.have.status(200)
            expect(response.body).to.be.an("object")
            done()
        })
     })

})