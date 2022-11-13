const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    groupCode: {
      type: mongoose.Types.ObjectId,
      ref: "GroupCode",
    },
    subject: String,
    difficulty: String,
    question: {
      type: String,
      required: [true, "question field is required"],
    },
    correctAnswer: {
      type: String,
      required: [true, "correctAnswer field is required"],
    },
    incorrectAnswer: {
      type: [String],
      required: [true, "incorrectAnswer field is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
