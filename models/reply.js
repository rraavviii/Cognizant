const mongoose=require('mongoose')

let replySchema=mongoose.Schema({
    user:
    {type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date:{
        type:Date,
        default:Date.now
    },
    content: String
    // reply:[
    //     {type: mongoose.Schema.Types.ObjectId,
    //       ref:'user',
    //       content: String

    //     }
    // ]
  
})

module.exports=mongoose.model('reply',replySchema)