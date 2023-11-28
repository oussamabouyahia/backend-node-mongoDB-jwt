const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: [true, "this email already used"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
