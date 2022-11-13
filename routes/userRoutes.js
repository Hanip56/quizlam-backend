const router = require("express").Router();
const {
  register,
  login,
  getMe,
  updateUser,
  getUser,
  getRangking,
} = require("../controllers/userCtrl");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe);

router.route("/:id").put(protect, updateUser);
router.route("/").get(protect, getUser);

router.get("/rangking", getRangking);

module.exports = router;
