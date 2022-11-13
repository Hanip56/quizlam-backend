const asyncHandler = require("express-async-handler");
const Question = require("../models/Question");
const GroupCode = require("../models/GroupCode");
const { default: mongoose } = require("mongoose");

// get question
const getQuestions = asyncHandler(async (req, res) => {
  const subject = req.query.subject;

  let questions;
  if (subject) {
    questions = await Question.find({ subject });
  } else {
    questions = await Question.find();
  }

  res.status(200).json(questions);
});

// get daily question
const getDailyQuestion = asyncHandler(async (req, res) => {
  const randomQuestion = await Question.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(process.env.ADMIN_ID) } },
    { $sample: { size: 5 } },
  ]);

  res.status(200).json(randomQuestion);
});

// get group question
const getGroupQuestion = asyncHandler(async (req, res) => {
  const groupedQuestion = await Question.find({
    groupCode: req.params.groupId,
  });

  res.status(200).json(groupedQuestion);
});

const createQuestion = asyncHandler(async (req, res) => {
  const { question, correctAnswer, incorrectAnswer } = req.body;

  if (!question || !correctAnswer || !incorrectAnswer) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  try {
    const createdQuestion = await Question.create({
      author: req.body.author,
      groupCode: req.body.groupCode,
      difficulty: req.body.difficulty,
      question,
      correctAnswer,
      incorrectAnswer,
    });

    res.status(201).json(createdQuestion);
  } catch (error) {
    throw new Error(error);
  }
});

const updateQuestion = asyncHandler(async (req, res) => {
  const questionExist = await Question.findById(req.params.id);

  if (!questionExist) {
    res.status(404);
    throw new Error("Question not found");
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedQuestion);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const questionExist = await Question.findById(req.params.id);

  if (!questionExist) {
    res.status(404);
    throw new Error("Question not found");
  }

  await questionExist.remove();

  res.status(200).json(questionExist._id);
});

module.exports = {
  getQuestions,
  getDailyQuestion,
  getGroupQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
