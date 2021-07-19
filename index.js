const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const saltRounds = 5;
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost/healthylifeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));
const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
});
const userPlans = mongoose.Schema({
  email: String,
  plans: [
    {
      name: String,
      desc: String,
      rate: Number,
      img: String,
    },
  ],
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const User = new mongoose.model("users", userSchema);
const planDetails = new mongoose.model("plans", userPlans);
app.post("/signup", (req, res) => {
  let plainTextPass = req.body.psw;
  bcrypt.hash(plainTextPass, saltRounds, (err, hashedPass) => {
    if (err) throw err;
    signupDetails = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    };
    User.create(signupDetails, (err, response) => {
      if (err) {
        res.status(500).send();
      } else {
        res.redirect("/success");
      }
    });
    userPlanDetails = {
      email: req.body.email,
      plans: [],
    };
    planDetails.create(userPlanDetails, (err, response) => {
      if (err) {
        res.status(500).send();
        throw err;
      }
    });
  });
});
app.get("/plan1", (req, res) => {
  plan = {
    name: "Plan 1",
    desc: "Basic Body Building Plan",
    rate: 10000,
    img: "img/plan1.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/plan2", (req, res) => {
  plan = {
    name: "Plan 2",
    desc: "Intermediate Body Building Plan",
    rate: 15000,
    img: "img/plan2.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/plan3", (req, res) => {
  plan = {
    name: "Plan 3",
    desc: "Advanced Body Building Plan",
    rate: 20000,
    img: "img/plan3.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/plan4", (req, res) => {
  plan = {
    name: "Plan 4",
    desc: "Basic Yoga Plan",
    rate: 7000,
    img: "img/yoga1.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/plan5", (req, res) => {
  plan = {
    name: "Plan 5",
    desc: "Intermediate Plan",
    rate: 9000,
    img: "img/yoga2.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/plan6", (req, res) => {
  plan = {
    name: "Plan 6",
    desc: "Advanced Yoga Plan",
    rate: 11000,
    img: "img/yoga3.png",
  };
  planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
    if (err) throw err;
    else {
      res.redirect("/safeadd");
    }
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index1.html"));
});
app.get("/safeadd", (req, res) => {
  planDetails.find({email: req.cookies.userEmail}, (err, response) =>{
    if(err) throw err;
    else{
      var data = response[0];
      res.render("myplans",{data: data});
    }
  });
});
app.get("/notFound", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notfound.html"));
});
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.post("/login", (req, res) => {
  loginDetails = {
    email: req.body.email,
    password: req.body.psw,
  };
  User.find({ email: loginDetails.email }, (err, response) => {
    if (err) throw err;
    else {
      if (Object.entries(response).length === 0) {
        res.redirect("/notFound");
      } else {
        bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
          if (error) throw error;
          if (resp === true) {
            res.redirect("/successLogin");
          } else {
            res.redirect("/wrongPass");
          }
        });
      }
    }
  });
});
app.get("/myplans", (req, res) => {
  planDetails.find({email: req.cookies.userEmail}, (err, response) =>{
    if(err) throw err;
    else{
      var data = response[0];
      res.render("myplans",{data: data});
    }
  });
});
app.get("/successLogin", (req, res) => {
  res.cookie("userEmail", loginDetails.email);
  //console.log(loginDetails.email+" has logged in.");
  res.sendFile(path.join(__dirname, "public", "success.html"));
});
app.get("/wrongPass", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "wrongpass.html"));
});
app.get("/logout", (req, res) => {
  //console.log(req.cookies);
  res.clearCookie("userEmail");
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

