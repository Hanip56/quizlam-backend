const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExist = await User.findOne({ username });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  try {
    const createUser = await User.create({
      username,
      password,
    });

    res.status(200).json({
      user: {
        _id: createUser._id,
        username: createUser.username,
        xpPoint: createUser.xpPoint,
        achievement: createUser.achievement,
        followers: createUser.followers,
        followings: createUser.followings,
        createdAt: createUser.createdAt,
        updatedAt: createUser.updatedAt,
      },
      token: createUser.getSignedToken(),
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExist = await User.findOne({ username }).select("+password");

  if (!userExist) {
    res.status(400);
    throw new Error("User not found");
  }

  const isMatch = await userExist.matchPassword(password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    user: {
      _id: userExist._id,
      username: userExist.username,
      xpPoint: userExist.xpPoint,
      achievement: userExist.achievement,
      profilePicture: userExist.profilePicture,
      followers: userExist.followers,
      followings: userExist.followings,
      createdAt: userExist.createdAt,
      updatedAt: userExist.updatedAt,
    },
    token: userExist.getSignedToken(),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// user
const getUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

const updateUser = asyncHandler(async (req, res, next) => {
  let userExist;
  try {
    userExist = await User.findById(req.params.id);
  } catch (error) {
    // res.status(400);
    next(error);
  }

  if (!userExist) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.params.id.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Forbidden action");
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

const getRangking = asyncHandler(async (req, res) => {
  const rangked = await await User.find({ xpPoint: { $gt: 0 } }).sort({
    xpPoint: -1,
  });

  res.status(200).json(rangked);
});

module.exports = { register, login, getMe, getUser, updateUser, getRangking };
