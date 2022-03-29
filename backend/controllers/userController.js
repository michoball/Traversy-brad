const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const serveStatic = require("serve-static");

//@desc Register a new user
//@route  /api/users
//@access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Find if user already exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10); // 메서드는 소금 생성기, 소금을 생성하는 메서드이다. 솔트(salt)를 생성하는데 솔트는 해시 함수에서 암호화된 비밀번호를 생성할 때 추가되는 바이트 단위의 임의의 문자열이다.
  const hashedPassword = await bcrypt.hash(password, salt); // 암호화된 비번 비밀번호와 salt를 인자로 받아 암호화된 비밀번호를 생성한다.

  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword, // 비번 암호화하는거 필수
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }

  // res.send("Register Route");
});

//@desc Login a user
//@route  /api/users/login
//@access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // res.send("Login Route");
});

//@desc  Get current user
//@route  /api/users/me
//@access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});

// Generate token - 다른 폴더에 만들어도 됨
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
