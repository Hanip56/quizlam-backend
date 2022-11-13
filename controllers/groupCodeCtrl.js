const asyncHandler = require("express-async-handler");
const GroupCode = require("../models/GroupCode");
const Question = require("../models/Question");

const getGroupCode = asyncHandler(async (req, res) => {
  try {
    let groupCodes;
    if (req.query.author) {
      groupCodes = await GroupCode.find({ author: req.query.author });
    } else if (req.query.code) {
      groupCodes = await GroupCode.findOne({ code: req.query.code });
    } else {
      groupCodes = await GroupCode.find();
    }

    res.status(200).json(groupCodes);
  } catch (error) {
    throw new Error(error);
  }
});

const createGroupCode = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const groupCodeExist = await GroupCode.findOne({ code });

  if (groupCodeExist) {
    res.status(400);
    throw new Error("This name or code has already been used");
  }

  try {
    const createdGroupCode = await GroupCode.create({
      author: req.body.author,
      name,
      code,
    });

    res.status(201).json(createdGroupCode);
  } catch (error) {
    throw new Error(error);
  }
});

const updateGroupCode = asyncHandler(async (req, res) => {
  const gc = await GroupCode.findById(req.params.id);

  if (!gc) {
    res.status(404);
    throw new Error("GroupCode not found");
  }

  try {
    const updatedGc = await GroupCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedGc);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteGroupCode = asyncHandler(async (req, res) => {
  const gc = await GroupCode.findById(req.params.id);

  if (!gc) {
    res.status(404);
    throw new Error("GroupCode not found");
  }

  await Question.deleteMany({ groupCode: gc._id });
  await gc.remove();

  res.status(200).json(gc._id);
});

module.exports = {
  getGroupCode,
  createGroupCode,
  updateGroupCode,
  deleteGroupCode,
};
