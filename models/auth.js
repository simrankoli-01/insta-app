const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/dz1qj3k5h/image/upload/v1698851234/noimage_owxj2f.png",
    required: true
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User"
    },
  ],
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
