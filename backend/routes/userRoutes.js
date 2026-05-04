const express = require("express");
const { searchUsers } = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);
router.get("/", searchUsers);

module.exports = router;
