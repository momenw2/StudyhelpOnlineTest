const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  fullName: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  myApplicationsTable: [
    {
      University: String,
      Major: String,
      Major2: String,
      Major3: String,
      Language: String,
      Time: String,
      Apply: Boolean,
    },
  ],
  progressTable: [
    {
      Name: String,
      UniversityName: String,
      State: String,
      PS: Boolean,
      CV: Boolean,
      Passport: Boolean,
    },
  ],
  __v: { type: Number, select: false }, // Ensure __v is defined as Number
});

// Fire a function before doc saved to DB
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
