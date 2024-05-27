const User = require("../Models/User.model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

//Handel Errors
const handelErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //Duplicate error code
  if (err.code === 11000) {
    //duplicate error code
    errors.email = "That email is already registered";
    return errors;
  }

  //Incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered";
  }
  //Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "That password is incorrect";
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signupPage");
};

module.exports.login_get = (req, res) => {
  res.render("loginPage");
};

module.exports.signup_post = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const user = await User.create({ email, password, fullName });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log("Received cookies:", req.cookies); // Log cookies received in the request
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
