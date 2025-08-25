const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mainRouter = require('./routes/index')
const query = require('./query')
const {rateLimit} = require('express-rate-limit');
const cors = require('cors');

app.use(express.json());

require('dotenv').config();
app.use(cors());
//Allowing all origin

const dbstring = process.env.dbstring;
if (process.env.NODE_ENV ==='production') {
  console.log = function () {}; // Disable all console.log statements in production
}
else {
  console.log("Development mode: console logs are enabled.");
}




console.log(process.env.NODE_ENV);  // Access NODE_ENV
const PORT = process.env.PORT;
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 30, // each IP can make up to 10 requests per `windowsMs` (1 minutes)
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
    message:"Too many request at a time "
  });
  app.use(limiter);

  //database Connection 
const  dbConnection = async()=>{
   try
   {
    await mongoose.connect(dbstring);
    console.log('Sucessfully Connected to Database');
   }
   catch(err)
   { 
    console.log(dbstring);
    console.log('Counld not Connect to Database, due to '+ err);

   }
};



app.use('/payment/vi', mainRouter);

app.use('/payment/vi/query', query);

// /payment/vi/user/signup
// /payment/vi/user/signin
// /payment/vi/user/changePassword

// /payment/vi/account/transferMoney
// /payment/vi/account/balance


app.listen(PORT,()=>{
    dbConnection();
    console.log("Listen at Port: ",PORT);
});