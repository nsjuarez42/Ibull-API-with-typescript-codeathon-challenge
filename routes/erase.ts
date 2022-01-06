import {fsImpl as Database} from "../db/fsImpl"
//export {}
import {Request,Response} from 'express'
let express = require('express');
let router = express.Router();

// Route to delete all trades

router.delete("/",(req:Request,res:Response)=>{
 const db = new Database;

 if(db.deleteTrades()){
     res.status(200).send("All trades were deleted successfully")
 }
})

module.exports = router;
