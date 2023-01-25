const bodyparser =require('body-parser');
const routes =require('./routes/API');
const express = require ('express');
const app = express();
const cors = require ('cors');
const mongoose = require('mongoose');// importing mongoose
app.use(
    cors({
    origin:'http://localhost:3000',
    }));
app.use(bodyparser.json());
app.use(routes);
app.use((err, req,res, next)=>{
    res.status(422).send({error: err.message});
});
mongoose.connect('mongodb://localhost/studentdb');
app.listen(process.env.port || 4000, function(){
    console.log('Now listening for request on:http://localhost:4000');
});

//connect to mongodb and create studentdb

