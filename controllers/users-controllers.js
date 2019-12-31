const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Molly Weasly",
    email: "molly@test.com",
    password: "testing"
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://cdn.pixabay.com/photo/2015/07/09/00/29/woman-837156_1280.jpg",
    password,
    places
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user", 401);
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
