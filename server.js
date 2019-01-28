var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var articleModel = require("./models/article.js");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));
var exphbs = require("express-handlebars");

app.engine("handlebars",exphbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scraperhw", { useNewUrlParser: true });

app.get('/', function(req,res){
 res.render('home')
})

app.get("/scrape", function(req, res) {
    console.log('we hit our /scrape!!')
    axios.get("https://www.npr.org/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $(".title").each(function(i, element) {
    console.log('did we find our titles ??', $(this).text())
        var articleToSave = {
            headline:  $(this).text(),
            url: '',
            summary: ''
        }
        articleModel.create(articleToSave).then(function(thingFromDB){
            console.log('thing from db!!!', thingFromDB)
        })
      });
  
      res.send("Scrape Complete");
    });
  });
  
app.get('/allArticles', function(req, res){
    articleModel.find({}).then(function(thingFromDB){
        res.json(thingFromDB)
    })

})
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});