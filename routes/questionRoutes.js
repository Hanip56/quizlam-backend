const router = require("express").Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getGroupQuestion,
  getDailyQuestion,
} = require("../controllers/questionCtrl");
const schedule = require("node-schedule");
const Question = require("../models/Question");
const mongoose = require("mongoose");
const GroupCode = require("../models/GroupCode");
const asyncHandler = require("express-async-handler");

let randomQuestion = [];

const job = schedule.scheduleJob("0 0 * * *", async function () {
  try {
    randomQuestion = await Question.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(process.env.ADMIN_ID) } },
      { $sample: { size: 5 } },
    ]);
    console.log(randomQuestion);
  } catch (error) {
    console.log(error);
  }
});

router.route("/").get(getQuestions).post(createQuestion);

router.route("/group/:groupId").get(getGroupQuestion);

router.route("/:id").put(updateQuestion).delete(deleteQuestion);

router.get("/daily", async (req, res) => {
  const before = await Question.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(process.env.ADMIN_ID) } },
    { $sample: { size: 5 } },
  ]);

  if (randomQuestion.length < 1) {
    res.status(200).json(before);
  } else {
    res.status(200).json(randomQuestion);
  }
});

router.get(
  "/code/:code",
  asyncHandler(async (req, res, next) => {
    const groupId = await GroupCode.findOne({ code: req.params.code });

    if (!groupId) {
      res.status(400);
      throw new Error("Kode tidak valid");
    }

    res.status(200).json(groupId._id);
  })
);

module.exports = router;
