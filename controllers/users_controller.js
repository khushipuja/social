const User = require('../models/user');
const multer=require('multer');
const fs=require('fs');
const path=require('path');
const resetSchema=require('../models/reset-password-token');
const crypto=require('crypto');
// let's keep it same as before
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
 
}


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

if(req.user.id==req.params.id)
{

try{

let user=await User.findById(req.params.id);

// upload(req, res, function(err) {
//     console.log("File uploaded");
//     res.end('File is uploaded')
// })
console.log(User.avatarPath);
User.uploadedAvatar(req,res,function(err){
if(err)
{
    console.log("**********MULTER ERROR: ",err);
}
console.log(req.file);
user.name=req.body.name;
user.email=req.body.email;
if(req.file)
{
    if(user.avatar)
    {
        fs.unlinkSync(path.join(__dirname,"..",user.avatar));
    }
    user.avatar=User.avatarPath+'/'+req.file.filename;
}
user.save();
return res.redirect('back');
});


}catch(err)
{

req.flash('error',err);
console.log(err);
return res.redirect('back');

}




}
else{

    req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
}

}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}
module.exports.forgotpassword=function(req,res)
{
    
    return res.render('forgotpassword',{title:'Retrieve your password'});
    
}
module.exports.retrieve=async function(req,res)
{
    try{
        var email=req.body.email;
        console.log(email);
        token = crypto.randomBytes(32).toString('hex');
        
        let user=User.findOne({email:email});
        console.log(user);
        if(user)
        {
            
            let accessSchema=resetSchema.create({
                user:user,
                token:token,
                isvalid:true
            });
            accessSchema=(await accessSchema).populate('user');
            return res.render('confirm-password',{title:"confirm password",user:user});
        }
        else
        return res.redirect('back');
        
        
        
    }
    catch(err)
    {
        console.log(err);
        return res.redirect('back');
    }

}
module.exports.changePassword=function(req,res)
{
var p1=req.body.p1;
var p2=req.body.p2;
if(p1!=p2)
return res.redirect('/users/sign-in');
User.findByIdAndUpdate(req.params.id,function(err,user){
if(err)
{
    console.log(err);return;
}
user.password=p1;
return res.redirect('/users/sign-in');

});

}