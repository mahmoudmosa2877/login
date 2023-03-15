const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { phone, password } = req.body;

  // 1) Check if email and password exist
  if (!phone || !password) {
    return next(new AppError("Please provide phone and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ phone }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
    });
    console.log(newUser);
    newUser.passwordConfirm = "";
    //  createSendToken(newUser, 201, req, res);
    res.status(201).json({
      status: "success",
      data: {
        data: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      data: {
        data: err,
      },
    });
  }
});

exports.list = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: "success",
    data: {
      data: users,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  const token = req.body.token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // } else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }
  console.log(token, typeof token);
  if (!token) {
    res.status(404).json({
      status: "fail",
      data: {
        data: false,
        err: "token is mot found",
      },
    });
  }
  try {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      data: {
        data: true,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      data: {
        data: false,
      },
    });
  }
});
