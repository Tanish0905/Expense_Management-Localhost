// npm init -y , npm i express , mongoose , npm inpm i , npm i  morgan 
// , npm i dotenv , nodemon , cors , bodyparser 
//npm i moment  to deal with dates
// npm i concurrently this is for running two servers on one command


//npm run dev is cmnd in this program to run both client and server side 
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const colors = require("colors")
const connectDb = require("./config/connectDb");

// config dotenv file
dotenv.config();

//database call
connectDb();

//rest object 
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
// user routes
app.use('/api/v1/users',require("./routes/userRoute"));


//transaction routes
app.use('/api/v1/transactions',require("./routes/transactionRoutes"));

 //  port
 const port= 8080 || process.env.PORT;

 // add this to client>package.json   "proxy": "http://localhost:8080/api/vi",

 //listen
 app.listen(port,()=>{
    console.log("code is running on ",port);
 })