var express=require('express');
var app=express();
var expressSanitizer=require('express-sanitizer');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override')
//Blog content:Title,Image URL,Body,Date of Creation


//Set up default mongoose connection
var mongoDB="mongodb://localhost/friends_demo_db"
//var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//app.use("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer())//included after the bodyParser
app.use(express.static("public"));
app.use(methodOverride("_method"))
//Mongoose Config
var friendsSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    Created:{type:Date,default:Date.now()}
})

var Friends=mongoose.model("Friends",friendsSchema);
//Test Data 
//Friends.create({
//     title:"Ross",
//     image:"https://wallpapercave.com/wp/wp4023513.png",
//     body:"He is a dianasor geek!!"
// })

//Restful Rotes
app.get("/",(req,res)=>{
    res.redirect("/friends")
})

//index route
app.get("/friends",(req,res)=>{
    Friends.find({},(err,friends)=>{
        if(err)
        console.log("Error")
        else
        res.render("index.ejs",{friends:friends})
    })
})

//new route
app.get("/friends/new",(req,res)=>{
    res.render("new.ejs");
})
//create route
app.post("/friends",(req,res)=>{
    //create blog
    req.body.friend.body=req.sanitize(req.body.friend.body)
    Friends.create(req.body.friend,(err,newFriend)=>{
        if(err)
        res.render("new.ejs")
        else
         //redirect to home page
        res.redirect("/friends");

    })
   
})
//show route
app.get("/friends/:id",(req,res)=>{
    //  Friends.findById(id,callback)
    Friends.findById(req.params.id,(err,info)=>{
        if(err)
        res.redirect("/friends");
        else
        res.render("show.ejs",{blog:info})
    })
})
//edit route
app.get("/friends/:id/edit",(req,res)=>{
    Friends.findById(req.params.id,(err,editInfo)=>{
        if(err)
        res.redirect("/friends")
        else
        res.render("edit.ejs",{blog:editInfo})
    })
    
})
//update route
app.put("/friends/:id",(req,res)=>{
    //console.log(req.body)
    req.body.friend.body=req.sanitize(req.body.friend.body)
    Friends.findByIdAndUpdate(req.params.id,req.body.friend,(err,updatedInfo)=>{
        if(err)
        res.redirect("/friends")
        else
        res.redirect("/friends/"+req.params.id);

    })

})

//delete route
app.delete("/friends/:id",(req,res)=>{
    //console.log(req.params.id)
    Friends.findOneAndRemove(req.params.id,(err)=>{
        if(err)
        res.redirect("/friend/"+req.params.id);
        else
        res.redirect("/friends");
    })
})

app.listen(3000,()=>{
    console.log("App connected");
})