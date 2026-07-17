const express = require("express");
const router = express.Router();
const {
  registerUser,
  requestOTP,
  verifyOTP,
  refreshUserToken,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/refresh", refreshUserToken);

module.exports = router;
