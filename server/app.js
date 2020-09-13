require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

// error handler

// app.use(function(req,res,next){
// 	res.setHeader('Access-Control-Allow-Origin','*'); //http://localhost:3000,
// 	res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT,PATCH, DELETE');
// 	res.setHeader('Access-Control-Allow-Headers','*');
// 	res.setHeader('Access-Control-Allow-Credentials','true');
// 	next();
// });


app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => console.log(`Server started at port : ${port}`));
// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))