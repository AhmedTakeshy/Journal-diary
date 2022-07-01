const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path")
const mongoose = require('mongoose');
const methodOverride = require('method-override')


const homeStartingContent = "I believe in YOU; the one turning the pages will see the real ME, and will accept the raw form of mine rather than the plastic and sugary coated form. So now you crossed the line into my so called mental asylum… WELCOME… You are the CHOSEN ONE; tell everybody… About the content… Promise to Me : when in my old days I turn these pages I will see the real Me. I'll Imagine… will Improvise…will Imitate…will Incorporate… will Improve… You and Me is all I have to believe…";
const aboutContent = "It's just a simple diary to write what you want and talk with yourself peacefully.";
const contactContent = "We are here to represent your soul and you space the best contact you can do is to talk with yourself, and I'm sure that you will find that you missed it so much and it missed you as much as you do.";
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", (postSchema))


mongoose.connect('mongodb+srv://admin-takeshy:test25797@journal.wzkil5p.mongodb.net/journal')
  .then(() => {
  console.log("CONNECTED WITH MongoDB")
  })
  .catch((err) => {
    console.log("FAILED TO CONNECT")
    console.log(err);
  })
 
app.get("/", async (req, res) => {

  const posts = await Post.find({})

  res.render(`home`, { homeStartingContent, posts });
});


app.post("/compose", async (req, res) => {
  
  const postDetails = {
    title: req.body.title,
    content: req.body.post
  }
  const post = new Post(postDetails);

  await post.save();
  res.redirect("/");
});

app.get("/posts/:id", async (req, res) => {

  const id = req.params.id;
  const post = await Post.findById(id);

  res.render("post", { post });
})

app.get("/posts/:id/edit", async (req, res) => {

  const id = req.params.id;
  const post = await Post.findById(id)

  res.render("edit", { post });
})

app.put("/posts/:id", async (req, res) => {

  const id = req.params.id;
  const post = await Post.findByIdAndUpdate(id, req.body);

  res.redirect(`/posts/${post._id}`)
})

app.delete("/posts/:id", async(req, res) => {

  const id = req.params.id;
  await Post.findByIdAndDelete(id);
  
  res.redirect("/")
})


app.get("/about", (req, res) => {
  res.render(`about`, { aboutContent: aboutContent });
  res.redirect("/about");
});

app.get("/contact", (req, res) => {
  res.render(`contact`, {
    contactContent: contactContent
  });
  res.redirect("/contact");
});

app.get("/compose", (req, res) => {

  res.render("compose");
});











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
