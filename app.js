var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    methodOverride= require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser  = require("body-parser");
 //APP Config   
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));                      // for express to look for the css,It is set by the programmer
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());                          //should be used after the body parser
app.use(methodOverride("_method"));

//MONGOOSE  /  MODEL Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    blog: String,
    created:{type : Date,default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

//RESTFUL Routes
app.get("/",function(req,res){
    res.redirect("/blogs");    
});


//INDEX Route
app.get("/blogs",function(req,res){
    Blog.find({},function(error,blogs){
        if(error){
            console.log(error);
        }else{
           res.render("index",{blogs:blogs}); 
        }
    });
    
});
 
//NEW ROUTE
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs",function(req, res) {
    req.body.blog.blog =req.sanitize(req.body.blog.blog);
    Blog.create(req.body.blog,function(error,newBlog){
       if(error){
           res.render("new");
       } else{
           res.redirect("/blogs");
       }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(error,foundBlog){
       if(error){
           res.redirect("/blogs");
       }else{
           res.render("show",{blog :foundBlog});
       }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(error,foundBlog){
        if(error){
            res.redirect("blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
    
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.blog =req.sanitize(req.body.blog.blog);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,updatedBlog){
        if(error){
            res.render("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(error){
        if(error){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    }) ;
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Blog app has started");
});
