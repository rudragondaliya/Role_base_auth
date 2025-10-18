require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRouter = require("./routes/user.route");
const db = require('./configs/database')

const app = express();

db();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

app.use('/admin',require('./routes/index'))
app.use("/", userRouter);


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
