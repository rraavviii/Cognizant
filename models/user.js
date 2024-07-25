
const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/algouser')

let userSchema=mongoose.Schema({
    name: String,
    email:String,
    contact: Number,
    country: String,
    city: String,
    age: Number,
    password: String,
    gender: String,
    querries:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'querry'
        }
    ],
    replies:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'reply'
        }
    ]
})

module.exports=mongoose.model('user',userSchema)