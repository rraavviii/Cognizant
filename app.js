const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const querryModel=require('./models/querry')
const replyModel=require('./models/reply')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const port = 3000;
const key=require('./helper/generatekey')


app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());




app.get('/',function(req,res){
    res.render('register')
})



app.post('/register', async (req, res) => {
    let { name, email, contact, country, city, age,password, gender } = req.body;

    try {
        let user = await userModel.findOne({ email: email });
        if (user) {
            return res.json({ userExists: true });
        }

    } catch (error) {
        return res.status(500).send('Server Error');
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
           let user = await userModel.create({
              name,
              email,
              contact,
              country,
              city,
              age,
              password: hash,
              gender,
           });
           let token = jwt.sign({ email: email, userId: user._id }, key);
           res.cookie('token', token);
           res.redirect(`/login`)
        });
     });

});




app.get('/login', function (req, res) {
    res.render('login');
});




app.post('/login',async  function (req, res) {
    let {email, password}=req.body
   

    let user= await userModel.findOne({email:email})
   
    if(!user){
        return res.status(500).send('something went wrong');
    }

    bcrypt.compare(password,user.password,function(err,result){
        if (result) {
            let token = jwt.sign({ email: email, userId: user._id }, key);
            res.cookie('token', token);
            return res.status(200).redirect('/question');
         } else {
            res.redirect('/login');
         }
    })
});




app.get('/profile',isLoggedin,async function(req,res){
    let user = await userModel.findOne({ email: req.user.email })
    // console.log(user)
    res.render('profile',{user})
})



app.post('/querry',isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    let {content}=req.body

    let querry = await querryModel.create({
        user: user._id,
        content
     });
     user.querries.push(querry._id);
     await user.save();
     res.redirect('/question');


})

app.post('/reply',isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    let {content}=req.body

    let reply = await replyModel.create({
        user: user._id,
        content
     });
     user.replies.push(reply._id);
     await user.save();
     res.redirect('/question');


})

app.get('/question',isLoggedin, async function(req,res){
    let querries = await querryModel.find().populate('user');
   let currentuser=await userModel.findOne({email:req.user.email})
   
   res.render('question', { querries, currentuser});

})
app.get('/logout',(req,res)=>{

        res.cookie('token', "");
        res.redirect('/login');
})





function isLoggedin(req, res, next) {
    const token = req.cookies.token;
 
    if (!token) {
       return res.redirect('/login');
    }
    jwt.verify(token,key, (err, data) => {
       if (err) {
          console.log('Token verification failed:', err);
          return res.redirect('/login');
       }
       req.user = data;
       next();
    });
 }





 
app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server running on port ${port}`);
    }
});
