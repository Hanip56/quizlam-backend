const router = require("express").Router();
const {
  getGroupCode,
  createGroupCode,
  updateGroupCode,
  deleteGroupCode,
} = require("../controllers/groupCodeCtrl");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getGroupCode).post(protect, createGroupCode);

router.route("/:id").put(updateGroupCode).delete(deleteGroupCode);

module.exports = router;
