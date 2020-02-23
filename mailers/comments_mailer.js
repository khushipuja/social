const nodeMailer=require('../config/nodemailer');
exports.newComment=(comment)=>{
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/newcomments.ejs');
    console.log(comment);
    console.log('Inside Comment Mailer');
    nodeMailer.transporter.sendMail({
        from:"kp1714318@gmail.com",
        to:comment.user.email,
        subject:"New Comment Published",
        html:htmlString
    },(err,info)=>{
        if(err){console.log("error in sending mail ",err);return;
        }
        console.log('Message sent',info);
        return;
        
    });
    
}
