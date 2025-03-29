const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config();

//middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//routes import
const bookRoutes = require('./src/books/book.route.js');
const orderRoutes = require('./src/orders/order.route.js');
const userRoutes =  require("./src/user/user.route")
const adminRoutes = require("./src/stats/admin.stats")
//routes
app.use('/api/v1/books',bookRoutes);
app.use('/api/v1/order',orderRoutes);
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/admin", adminRoutes)


async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server up and running")
}

main().then(()=> console.log("MongoDB connected")).catch(err =>  console.log(err));


app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})

//F4oxPiNklLrKhlJE