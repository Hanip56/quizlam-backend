const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "name field is required"],
      unique: true,
    },
    code: {
      type: String,
      required: [true, "code field is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GroupCode", groupSchema);
