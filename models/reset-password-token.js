const mongoose = require('mongoose');


const resetSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accesstoken: {
        type:String,
        // required:true

       
    },
    isvalid:{
        type:Boolean,
        required:true
    }
},{
    timestamps: true
});

const reset = mongoose.model('reset', resetSchema);
module.exports = reset;