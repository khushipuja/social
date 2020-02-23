const queue=require('../config/kue');
const commentMiler=require('../mailers/comments_mailer');
queue.process('emails',function(job,done){
    console.log('emails worker processing jobs',job.data);
    commentMiler.newComment(job.data);
    done();

});