const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.URI).then(() => {
  app.listen(PORT, () => {
    console.log("server started on port " + PORT + "...");
  });

  console.log("Mongodb connected....");
});

app.get("*", checkUser);

app.get("/", (req, res) => res.render("home"));
app.get("/countries", (req, res) => res.render("countriesPage"));
app.get("/login", (req, res) => res.render("loginPage"));
app.get("/signup", (req, res) => res.render("signupPage"));
app.get("/countryUniPage", (req, res) => res.render("countryUni"));
app.get("/uni", (req, res) => res.render("uniPage"));
app.get("/profilePage", (req, res) => res.render("profilePage"));
app.get("/adminDashboard", (req, res) => res.render("adminDashboardPage"));
app.get("/adminDashboard-users", (req, res) =>
  res.render("adminDashboard-users")
);
app.get("/adminEditUser", (req, res) => res.render("adminEditUserPage"));

// Uni Router
const universityRoute = require("./Routes/uni.router");
app.use("/university", universityRoute);

// User  Router
const authRoutes = require("./Routes/auth-route");
app.use("/user", authRoutes);

//Error Handler
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
