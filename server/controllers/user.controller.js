const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { request } = require('express');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    const { fullName, email, password ,role} = req.body;
    console.log("testing");
    var user = new User({ fullName, email, password ,role});
    console.log("testing");
    user.save((err, doc) => {
        // console.log(user.fullName);
        // console.log(user.email);
        // console.log(user.password);
        // console.log(user.role);
        if (!err){
            console.log("sending data");
            res.send(doc);
            console.log("data sent correctly");
        }
        else {
            console.log("data error");
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    console.log("hello");
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req,res);
}

module.exports.userProfile =async (req, res, next) =>{
    console.log(req._id);
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email','role']) });
        }
    );
}

module.exports.getLeaves =async (req,res,next)=>{
    console.log("here...");
    console.log(req._id);
    // User.findOne({_id:req._id})
    // .then((user)=>{
    //     console.log(user.leaveRecords);
    //     const res=user.leaveRecords;
    //     return res.status(200).json({
    //         status:true,
    //         result:_.pick(res,['leaveRecors'])
    //     });
    // })
    // .catch((err)=>{
    //     return res.status(500).json({
    //         message:"No user found!"
    //     })
    // });
    User.findOne({_id:req._id},
        (err,user)=>{
            if(!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
            else
            return res.status(200).json({status:true,result:_.pick(user,['leaveRecords']) });
        }
    );

}

module.exports.getAllStudentsLeaveRecords=(req,res,next)=>{
    var temp;
    User.find({role:"student"}).then((user)=>{
        const result=user;
        return res.status(200).json({
            result
        })
    }).catch((err)=>{
        return res.status(500).json({
            message:"No user found!"
        })
    });
}

module.exports.getStudents = (req, res, next) => {
    // var result=await User.find({role:'student'});
    User.find({role:"student"}).then((user)=>{
        const result=user;
        return res.status(200).json({
            result
        })
    }).catch((err)=>{
        return res.status(500).json({
            message:"No user found!"
        })
    });
}

module.exports.postleave=async (req , res , next)=>{
    // var leave=new Leave({"reason":"...","student":req.body._id,"permission":false});
    // leave.save((err,doc)=>{
    //     if (!err){
    //         res.send(doc);
    //         console.log("leave sent correctly");
    //     }
    //     else {
    //         console.log("data error");
    //         return next(err);
    //     }
    // });
    // console.log("user is: ",req.body);
    // console.log("message is : ");

    const user = await User.findOne({ email: req.body.email });
    const leave = {
        reason: req.body.msg,
        student: user._id,
    }
    const userRecord = await User.findOneAndUpdate({ email: req.body.email }, { $push: { leaveRecords: leave }}, {new: true}).exec();
    console.log(userRecord);
    res.status(200).send(userRecord);


    // User.findOne({email:req.body.email})
    // .then((user)=>{
    //     // console.log(user);
    //     if(user!=null){
    //         req.body.student=user._id;
    //         req.body.reason=req.body.msg;
    //         user.leaveRecords.push(req.body);
    //         console.log(req.body);
    //         user.save()
    //         .then((user)=>{
    //             User.findById(user._id)
    //             // .populate('leaveRecords.student')
    //             .then((user)=>{
    //                 res.statusCode=200;
    //                 res.setHeader('Content-Type','application/json');
    //                 res.json(user);
    //             })
    //         },(err)=>next(err));
    //     }
    //     else{
    //         err=new Error("Not posted correctly");
    //         err.statusCode=404;
    //         return next(err);
    //     }
    // },(err)=>next(err))
    // .catch((err)=>next(err));




    /*User.find({email:req.body.email})
    .populate(req.body._id)
    .then((user)=>{
        if(user!=null){
            req.body.student=user._id;
            req.body.reason=req.body.msg;
            // user.leaveRecords.push(req.body);
            console.log(req.body);
            User.findById(user._id)
            // .populate('leaveRecords.student') 
            .then((user)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(user);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
        else{
            err=new Error("Not posted correctly");
            err.statusCode=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
    // User.updateOne({email:req.body.email},
    //     [
    //         { $set: {student:user._id,reason:req.body.msg } }
    //     ]
    // );
    /*leaves:Array;
    User.findOne({email:req.body.email})
    // .populate('leaveRecords.student')
    .then((user)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(user);
    },(err)=>next(err))
    .catch((err)=>next(err));*/
}

module.exports.changeLeaveStatus =async (req,res,next)=>{
    try {
        // if(req.body.==true){
            console.log(req.body.student);
            console.log(req.body.leave.permission);
            console.log(req.body.ind);
            let tmp=req.body.ind;
            const temp=req.body.student.leaveRecords[req.body.ind];
            console.log(temp);
            let permit=!req.body.leave.permission;
            // if(req.body.leave.permission==false){
            /* await User.update({ email: req.body.student.email },
                                    { $set: { req.body.student.leaveRecords.tmp : true } })
                                    .then((obj) => { 
                                        console.log('Updated - ' + obj); 
                                        res.redirect('orders') 
                                        }) 
                                        .catch((err) => {
                                            console.log('Error: ' + err); 
                                        }) */
                                        // .then(doc => {
                                        //     return(doc); // <-- returns a pending promise
                                        // });
                // console.log(chnge);



                
                const query = { email: req.body.student.email };
                // Set some fields in that document
                const update = {
                $set: {
                    'leaveRecords.$[req.body.ind].reason.content':"mm"
                }
                };
                // Return the updated document instead of the original document
                // const options = { returnNewDocument: true };
                // return User.findOneAndUpdate(query, update, options)
                //   .then(updatedDocument => {
                //     if(updatedDocument) {
                //       console.log(`Successfully updated document: ${updatedDocument}.`);
                //     } else {
                //       console.log("No document matches the provided query.");
                //     }
                //     return updatedDocument;
                //   })
                //   .catch(err => console.error(`Failed to find and update document: ${err}`));


                let vl='leaveRecords.'+tmp+'.permission';
                await User.updateOne(
                    {email:req.body.student.email},
                    // {$set:{"leaveRecords.tmp.permission":true}}
                    {$set:{[`leaveRecords.${tmp}.permission`]:permit}}
                )

                
                res.status(200).send({ message: "successful"});
                console.log("yeyy");
            // } 
        // else{
            // console.log("nnoo");
        // }
    }
    catch(err) {
        res.status(500).send({error: "Internal Server Error" });
    }
}