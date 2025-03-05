require("dotenv").config(); 

const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
require("./db/mongoose");
const userRoute = require("./routers/user");
const taskRoute = require("./routers/task");
const authRoute = require("./routers/auth");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(flash());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect('/list');
});

app.use(userRoute);
app.use(taskRoute);
app.use(authRoute);

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
