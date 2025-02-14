//npm run dev is cmnd in this program to run both client and server side 
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
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
app.get("/", (req, res) => {
  res.send("Welcome to Expense Management API!");
});

//static files
// app.use( express.static( path.join( __dirname, './client/build' ) ) );

// app.get( '*', function ( req, res ) {
//    res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

 //  port
 const port= process.env.PORT;

 //listen
 app.listen(port,()=>{
    console.log("code is running on ",port);
 })