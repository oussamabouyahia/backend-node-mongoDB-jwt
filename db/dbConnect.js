const mongoose = require("mongoose");
require("dotenv").config();

async function connectDb() {
  mongoose
    .connect(process.env.DBURL)
    .then(() => console.log("db connect successfully"))
    .catch((err) => console.log(err.message));
}

module.exports = connectDb;

// User Model below , it is created in a separate file userModel.js below code
// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const UserSchema = new Schema({
//   email: {
//     type: String,
//     required: [true, "please enter an email"],
//     unique: [true, "this email already used"],
//   },
//   password: {
//     type: String,
//     required: [true, "please enter a password"],
//     unique: false,
//   },
// });

// module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
