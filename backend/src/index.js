// require('dotenv').config({path:'/env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
// when using db always use try catch and async await to avoid errors

dotenv.config({
        path:'./.env'
})

// async functions return some promises

connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("ERROR",err);
        throw error  
    })
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running at port :http://${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !",err)
})










