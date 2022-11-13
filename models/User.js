const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username field is required"],
      unique: [true, "Username must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
      minlength: 6,
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    profilePicture: {
      type: String,
    },
    xpPoint: {
      type: Number,
      default: 0,
    },
    rangking: Number,
    achievement: [],
    followers: [],
    followings: [],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
