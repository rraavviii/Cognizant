const mongoose=require('mongoose')


let querrySchema=mongoose.Schema({

    user:
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        date:{
            type:Date,
            default:Date.now
        },
        content: String,
    
})

module.exports = mongoose.model('querry',querrySchema)