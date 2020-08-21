//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://admin:nishantpatil12345@library.6rclc.mongodb.net/libraryDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  id: Number,
  dateDate: Number,
  dateMonth: Number,
  duration: Number,
  bookIsuued: Number,
  note: String,
  returnedStatus: Boolean
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home", {
    homePage: "/"
  });
});

app.post("/", function(req, res) {
  const button1 = req.body.button1;
  const button2 = req.body.button2;
  if (button1 === "true") {
    res.redirect("newBook");
  } else if (button2 === "true") {
    res.redirect("findUser");
  }
});

app.get("/newBook", function(req, res) {
  var date = new Date();
  var dateDate = date.getDate();
  var dateMonth = date.getMonth();
  res.render("newBook", {
    homePage: "/",
    dateDateOfBook: dateDate,
    dateMonthOfBook: dateMonth
  });
});

app.post("/newBook", function(req, res) {
  const customerID = req.body.customerID;
  const dateDate = req.body.dateDate;
  const dateMonth = req.body.dateMonth;
  const duration1 = req.body.duration1;
  const duration2 = req.body.duration2;
  const duration3 = req.body.duration3;
  var duration;
  if (duration1 === "true") {
    duration = 7;
  } else if (duration2 === "true") {
    duration = 30;
  } else if (duration3 === "true") {
    duration = 90;
  }
  const bookID = req.body.bookID;
  const note = req.body.comments;

  User.findOne({
    id: customerID
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.returnedStatus === true) {
          foundUser.dateDate = dateDate;
          foundUser.dateMonth = dateMonth;
          foundUser.duration = duration;
          foundUser.bookIsuued = bookID;
          foundUser.note = note;
          returnedStatus = false;
        } else {
          res.render("returnYourBookFirst", {
            homePage: "/"
          });
        }
      } else {
        const newUser = new User({
          id: customerID,
          dateDate: dateDate,
          dateMonth: dateMonth,
          duration: duration,
          bookIsuued: bookID,
          note: note,
          returnedStatus: false
        });
        newUser.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.render("success", {
              homePage: "/",
              successResult: "Issued"
            });
          }
        });
      }
    }
  });

});

app.get("/findUser", function(req, res) {
  res.render("findUser", {
    homePage: "/"
  });
});

app.post("/findUser", function(req, res) {
  const customerId = req.body.findUser;
  User.findOne({
    id: customerId
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      var date = new Date();
      var dateDate = date.getDate();
      var dateMonth = date.getMonth();
      var total = foundUser.duration * 5;
      res.render("returnBook", {
        homePage: "/",
        customerId: foundUser.id,
        dateDateOfBook: foundUser.dateDate,
        dateMonthOfBook: foundUser.dateMonth,
        dateDateOfBookR: dateDate,
        dateMonthOfBookR: dateMonth,
        duration: foundUser.duration,
        nameOfBook: foundUser.bookIsuued,
        total: total
      });
    }
  });
});

app.get("/returnBook", function(req, res) {
  res.render("returnBook", {
    homePage: "/"
  });
});

app.post("/returnBook", function(req, res) {
  const customerId = req.body.customerID;
  User.findOneAndUpdate({
    id: customerId
  }, {
    dateDate: 0,
    dateMonth: 0,
    duration: 0,
    bookIsuued: 0,
    note: "",
    returnedStatus: true
  }, function(err) {
    if (err) {
      console.log(err);
    } else {

      res.render("home", {
        homePage: "/"
      });
    }
  });
});

app.post("/success", function(req, res){
  res.render("home", {
    homePage: "/"
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(req, res) {
  console.log("Server started at port 3000.");
});
