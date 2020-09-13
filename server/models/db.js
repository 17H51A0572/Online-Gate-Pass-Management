const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
})
.then(()=>{
    console.log("DB connected");
})
.catch(()=>{
    console.log("Error Occurred While connecting");
})

require('./user.model');