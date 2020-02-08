const User=require('../../../models/user');
const jwt=require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    try{
let user= await User.findOne({email:req.body.email});
if(!user||user.password!=req.body.password)
{

    return res.json(422,{
        message:"Invalid username/password"
    });
}

return res.json(200,{
    message:"Your sign-in was successfull ,please keep the token safe!",
    data:{
        token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'100000'})
    }
});


    }catch(err)
    {
        console.log('********ERROR: ',err);
        res.json(200,{
            message:"Internal Server Error"
        });

    }
}
