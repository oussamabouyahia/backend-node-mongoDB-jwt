const User = require("../db/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const listOfUsers = async (req, res) => {
  const listOfUsers = await User.find();
  listOfUsers.length
    ? res.status(200).json(listOfUsers)
    : res.status(404).json({ message: "no users found" });
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const targetUser = await User.findById(id);
    targetUser
      ? res
          .status(200)
          .json({ message: "user found successfully!", targetUser })
      : res.status(404).send("user not found");
  } catch (error) {
    res.sendStatus(500);
  }
};
const register = async (req, res) => {
  const { email, password } = req.body;
  //check email and password existing
  if (!email || !password) return res.sendStatus(401);
  try {
    //check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "email already used" });
    else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashPassword });
      newUser
        .save()
        .then(() =>
          res.status(201).json({ message: "user added successfully", newUser })
        )
        .catch((err) => res.sendStatus(500));
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  // at minimum one input to update a user
  if (!email && !password) {
    return res
      .status(400)
      .json({ error: "Email or password is required for update." });
  }
  try {
    const targetUser = await User.findById(id);
    //if user exist will be updated
    if (targetUser) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { email: email, password: await bcrypt.hash(password, 10) },
        { new: true }
      );
      updatedUser
        ? res.status(200).json({ message: "user updated successfully" })
        : res.sendStatus(500);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  //id should be provided
  if (!id)
    return res
      .status(400)
      .send("a selected user is required to complete deleting");
  try {
    const targetUser = await User.findById(id);
    //if user exist will be deleted and a new list of users updtated accordingly
    if (targetUser) {
      await User.findByIdAndDelete(id);
      res.status(200).json({
        message: `user ${targetUser.email} deleted successfully `,
        newList: await User.find(),
      });
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("email and password are required");
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "60s",
          }
        );
        res
          .status(200)
          .json({ message: "logged in successfully", accessToken });
      } else {
        res.status(401).send("unauthorized access, wrong password");
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
module.exports = {
  listOfUsers,
  getUserById,
  register,
  updateUser,
  deleteUser,
  login,
};
