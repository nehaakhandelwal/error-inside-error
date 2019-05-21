//this file hold the express appwhich is still a Nodejs server side app
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();
mongoose.connect("mongodb+srv://neha:fM3MKMKVDHNR42Rb@cluster0-mgg6t.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
.then(() => {
 console.log('Connected to DB');
})
.catch(() => {
  console.log('Connection failed!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));


app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts", postsRoutes);
module.exports = app;